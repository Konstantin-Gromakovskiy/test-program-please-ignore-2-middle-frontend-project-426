import { expect, test, type Page } from "@playwright/test";
import { products } from "../db/catalog.js";

const findProduct = (name: string) => {
  const found = products.find((item) => item.name === name);
  if (!found) throw new Error(`Товара «${name}» нет в сидах`);
  return found;
};

const inStock = findProduct("AMD Ryzen 5 7600");
const outOfStock = findProduct("AMD Ryzen 9 7950X");

// тот же формат, что в приложении: цена в базе хранится в копейках
const formatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
});
const rubles = (kopecks: number) => formatter.format(kopecks / 100);

const items = (page: Page) => page.getByTestId("cart-item");

async function openProduct(page: Page, name: string) {
  await page.goto("/catalog");
  await page.getByTestId("filter-search").fill(name);
  const link = page.getByTestId("catalog-item-name").filter({ hasText: name });
  await expect(link).toHaveCount(1);
  await link.click();
  await expect(page.getByTestId("product-page")).toBeVisible();
}

async function addToCart(page: Page, name: string) {
  await openProduct(page, name);
  await page.getByTestId("product-add-to-cart").click();
  await page.getByTestId("nav-cart").click();
  await expect(page.getByTestId("cart-page")).toBeVisible();
}

test("карточка товара открывается и показывает название, цену и описание", async ({
  page,
}) => {
  await openProduct(page, inStock.name);

  await expect(page).toHaveURL(/\/products\/.+/);
  await expect(page.getByTestId("product-name")).toHaveText(inStock.name);
  await expect(page.getByTestId("product-price")).toHaveText(
    rubles(inStock.price),
  );
  await expect(page.getByTestId("product-description")).toHaveText(
    inStock.description,
  );
});

test("товар добавляется в корзину и появляется в ней", async ({ page }) => {
  await openProduct(page, inStock.name);
  await page.getByTestId("product-add-to-cart").click();
  await expect(page.getByTestId("nav-cart-count")).toHaveText("1");

  await page.getByTestId("nav-cart").click();

  await expect(items(page)).toHaveCount(1);
  await expect(page.getByTestId("cart-item-name")).toHaveText(inStock.name);
  await expect(page.getByTestId("cart-item-price")).toHaveText(
    rubles(inStock.price),
  );
  await expect(page.getByTestId("cart-item-qty")).toHaveValue("1");
  await expect(page.getByTestId("cart-total")).toHaveText(
    rubles(inStock.price),
  );
});

test("количество позиции меняется, итоговая сумма пересчитывается", async ({
  page,
}) => {
  await addToCart(page, inStock.name);

  await page.getByTestId("cart-item-qty").fill("3");

  await expect(page.getByTestId("cart-item-qty")).toHaveValue("3");
  await expect(page.getByTestId("cart-item-total")).toHaveText(
    rubles(inStock.price * 3),
  );
  await expect(page.getByTestId("cart-total")).toHaveText(
    rubles(inStock.price * 3),
  );
});

test("позиция удаляется из корзины", async ({ page }) => {
  await addToCart(page, inStock.name);
  await expect(items(page)).toHaveCount(1);

  await page.getByTestId("cart-item-remove").click();

  await expect(items(page)).toHaveCount(0);
  await expect(page.getByTestId("cart-empty")).toBeVisible();
  await expect(page.getByTestId("nav-cart-count")).toBeHidden();
});

test("состав корзины сохраняется после перезагрузки страницы", async ({
  page,
}) => {
  await addToCart(page, inStock.name);
  await page.getByTestId("cart-item-qty").fill("2");
  await expect(page.getByTestId("cart-total")).toHaveText(
    rubles(inStock.price * 2),
  );

  await page.reload();

  await expect(items(page)).toHaveCount(1);
  await expect(page.getByTestId("cart-item-name")).toHaveText(inStock.name);
  await expect(page.getByTestId("cart-item-qty")).toHaveValue("2");
  await expect(page.getByTestId("cart-total")).toHaveText(
    rubles(inStock.price * 2),
  );
});

test("недоступный товар в корзину не добавляется", async ({ page }) => {
  await openProduct(page, outOfStock.name);

  await expect(page.getByTestId("product-availability")).toHaveAttribute(
    "data-available",
    "false",
  );
  await expect(page.getByTestId("product-add-to-cart")).toBeDisabled();
  await page.getByTestId("product-add-to-cart").click({ force: true });

  await expect(page.getByTestId("nav-cart-count")).toBeHidden();
  await page.getByTestId("nav-cart").click();
  await expect(page.getByTestId("cart-empty")).toBeVisible();
  await expect(items(page)).toHaveCount(0);
});

test("пустая корзина показывает своё состояние и не пускает к оформлению", async ({
  page,
}) => {
  await page.goto("/cart");

  await expect(page.getByTestId("cart-empty")).toBeVisible();
  await expect(items(page)).toHaveCount(0);
  await expect(page.getByTestId("cart-checkout")).toBeHidden();
});
