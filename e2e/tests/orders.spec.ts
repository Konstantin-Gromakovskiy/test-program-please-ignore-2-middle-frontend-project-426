import { expect, test } from "../fixtures/users.js";
import { setProductPrice } from "../db/db.js";
import {
  addToCartAndCheckout,
  apiFetch,
  deliveryData,
  fillCheckoutForm,
  findProduct,
  getProductId,
  getStock,
  pickupData,
  pickupOrderBody,
  rubles,
  seedCart,
} from "../fixtures/orders.js";

const cheap = findProduct("Intel Core i3-12100F");
const other = findProduct("AMD Ryzen 5 7600");
const outOfStock = findProduct("AMD Ryzen 9 7950X");
// цену этого товара меняет только один тест, остальные его не трогают
const repriced = findProduct("Corsair Vengeance 32 ГБ DDR5-6000");
// остаток этого товара сравнивается до и после, поэтому его не заказывают другие тесты
const stockChecked = findProduct("Intel Core i5-13400F");

test("неавторизованный пользователь не может оформить заказ", async ({
  page,
  request,
}) => {
  await page.goto("/checkout");
  await expect(page).toHaveURL("/login");

  const productId = await getProductId(request, cheap.name);
  const response = await request.post("/api/orders", {
    data: pickupOrderBody([{ productId, quantity: 1 }]),
  });
  expect(response.status()).toBe(401);
});

test("авторизованный пользователь оформляет заказ и видит страницу успеха", async ({
  page,
  authenticatedUser: _user,
}) => {
  await addToCartAndCheckout(page, cheap.name);
  await fillCheckoutForm(page, deliveryData);

  const created = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/orders") &&
      response.request().method() === "POST",
  );
  await page.getByTestId("checkout-submit").click();
  expect((await created).status()).toBe(201);

  await expect(page).toHaveURL(/\/checkout\/success\?orderId=.+/);
  await expect(page.getByTestId("order-success")).toBeVisible();
  await expect(page.getByTestId("order-total")).toHaveText(rubles(cheap.price));
  // корзина после оформления пуста
  await expect(page.getByTestId("nav-cart-count")).toBeHidden();
});

test("пустую корзину оформить нельзя", async ({ page, authenticatedUser: _user }) => {
  await page.goto("/checkout");
  await expect(page.getByTestId("checkout-empty")).toBeVisible();
  await expect(page.getByTestId("checkout-form")).toBeHidden();

  const response = await apiFetch(page, "POST", "/api/orders", pickupOrderBody([]));
  expect(response.status).toBe(400);
});

test("итоговая сумма считается на сервере и не зависит от данных клиента", async ({
  page,
  authenticatedUser: _user,
}) => {
  const firstId = await getProductId(page.request, cheap.name);
  const secondId = await getProductId(page.request, other.name);

  const response = await apiFetch(
    page,
    "POST",
    "/api/orders",
    pickupOrderBody(
      [
        { productId: firstId, quantity: 2 },
        { productId: secondId, quantity: 3 },
      ],
      // клиент пытается подсунуть свои цифры
      { total: 1, unitPrice: 1, price: 1 },
    ),
  );

  expect(response.status).toBe(201);
  const order = response.body as {
    total: number;
    items: { productId: string; unitPrice: number; quantity: number }[];
  };
  const expected = cheap.price * 2 + other.price * 3;
  expect(order.total).toBe(expected);
  expect(order.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)).toBe(
    expected,
  );
});

test("при доставке адрес обязателен, при самовывозе не запрашивается", async ({
  page,
  authenticatedUser: _user,
}) => {
  await addToCartAndCheckout(page, cheap.name);

  let orderRequests = 0;
  page.on("request", (request) => {
    if (request.url().endsWith("/api/orders") && request.method() === "POST") {
      orderRequests += 1;
    }
  });

  // доставка без адреса: форма не отправляется
  await fillCheckoutForm(page, { ...deliveryData, address: "" });
  await page.getByTestId("checkout-submit").click();
  await expect(page.getByTestId("checkout-address")).toBeVisible();
  await expect(page.getByTestId("checkout-address")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  expect(orderRequests).toBe(0);

  // самовывоз: поля адреса нет, заказ оформляется
  await page.getByTestId("checkout-method").selectOption("pickup");
  await expect(page.getByTestId("checkout-address")).toBeHidden();
  await page.getByTestId("checkout-submit").click();
  await expect(page.getByTestId("order-success")).toBeVisible();
  expect(orderRequests).toBe(1);
});

test("сервер отклоняет доставку без адреса и самовывоз с адресом", async ({
  page,
  authenticatedUser: _user,
}) => {
  const productId = await getProductId(page.request, cheap.name);
  const items = [{ productId, quantity: 1 }];

  const noAddress = await apiFetch(
    page,
    "POST",
    "/api/orders",
    pickupOrderBody(items, { deliveryMethod: "delivery" }),
  );
  expect(noAddress.status).toBe(400);

  const extraAddress = await apiFetch(
    page,
    "POST",
    "/api/orders",
    pickupOrderBody(items, { shippingAddress: "г. Москва" }),
  );
  expect(extraAddress.status).toBe(400);
});

test("заказ с недоступным товаром отклоняется целиком, ошибка видна пользователю", async ({
  page,
  authenticatedUser: _user,
}) => {
  const availableId = await getProductId(page.request, stockChecked.name);
  const unavailableId = await getProductId(page.request, outOfStock.name);
  const stockBefore = await getStock(page.request, availableId);

  await seedCart(page, [
    { productId: availableId, quantity: 1 },
    { productId: unavailableId, quantity: 1 },
  ]);
  await page.goto("/checkout");
  await expect(page.getByTestId("checkout-page")).toBeVisible();
  await fillCheckoutForm(page, pickupData);

  const created = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/orders") &&
      response.request().method() === "POST",
  );
  await page.getByTestId("checkout-submit").click();
  const response = await created;

  expect(response.status()).toBe(409);
  const body = (await response.json()) as {
    problems: { productId: string; available: number }[];
  };
  expect(body.problems).toHaveLength(1);
  expect(body.problems[0]).toMatchObject({
    productId: unavailableId,
    available: 0,
  });

  await expect(page.getByTestId("order-error")).toContainText(outOfStock.name);
  await expect(page.getByTestId("order-success")).toBeHidden();

  // заказ не создан, остаток доступного товара не изменился
  const orders = await apiFetch(page, "GET", "/api/orders");
  expect((orders.body as { items: unknown[] }).items).toHaveLength(0);
  expect(await getStock(page.request, availableId)).toBe(stockBefore);
});

test("в личном кабинете видны заказы пользователя и не видны чужие", async ({
  page,
  browser,
  newUser,
  authenticatedUser: _user,
}) => {
  const productId = await getProductId(page.request, cheap.name);
  const created = await apiFetch(
    page,
    "POST",
    "/api/orders",
    pickupOrderBody([{ productId, quantity: 1 }]),
  );
  expect(created.status).toBe(201);

  await page.goto("/account");
  await expect(page.getByTestId("account-order-item")).toHaveCount(1);

  // второй пользователь в отдельном контексте
  const otherContext = await browser.newContext();
  try {
    const registered = await otherContext.request.post("/api/auth/register", {
      data: newUser,
    });
    expect(registered.status()).toBe(201);

    const otherPage = await otherContext.newPage();
    await otherPage.goto("/account");
    await expect(otherPage.getByTestId("account-orders-empty")).toBeVisible();
    await expect(otherPage.getByTestId("account-order-item")).toHaveCount(0);

    const orders = await apiFetch(otherPage, "GET", "/api/orders");
    expect((orders.body as { items: unknown[] }).items).toHaveLength(0);
  } finally {
    await otherContext.close();
  }
});

test("открытый заказ показывает состав, количество, цены на момент покупки и итог", async ({
  page,
  authenticatedUser: _user,
}) => {
  // возвращаем исходную цену: тест не должен ломаться при повторном запуске и ретраях
  await setProductPrice(repriced.name, repriced.price);
  const repricedId = await getProductId(page.request, repriced.name);
  const cheapId = await getProductId(page.request, cheap.name);

  const created = await apiFetch(
    page,
    "POST",
    "/api/orders",
    pickupOrderBody([
      { productId: repricedId, quantity: 2 },
      { productId: cheapId, quantity: 1 },
    ]),
  );
  expect(created.status).toBe(201);

  // после покупки цена товара выросла: в заказе должна остаться старая
  await setProductPrice(repriced.name, repriced.price * 2);

  await page.goto("/account");
  const order = page.getByTestId("account-order-item");
  await expect(order).toHaveCount(1);
  await expect(order.getByTestId("order-status")).toHaveAttribute(
    "data-status",
    "paid",
  );
  await expect(order.getByTestId("account-order-line")).toHaveCount(0);

  await order.getByTestId("account-order-toggle").click();

  const lines = order.getByTestId("account-order-line");
  await expect(lines).toHaveCount(2);

  const repricedLine = lines.filter({ hasText: repriced.name });
  await expect(repricedLine.getByTestId("account-order-line-qty")).toHaveText("2");
  await expect(repricedLine.getByTestId("account-order-line-price")).toHaveText(
    rubles(repriced.price),
  );

  const cheapLine = lines.filter({ hasText: cheap.name });
  await expect(cheapLine.getByTestId("account-order-line-qty")).toHaveText("1");
  await expect(cheapLine.getByTestId("account-order-line-price")).toHaveText(
    rubles(cheap.price),
  );

  await expect(order.getByTestId("order-total")).toHaveText(
    rubles(repriced.price * 2 + cheap.price),
  );
});
