import { expect, type APIRequestContext, type Page } from "@playwright/test";
import { products } from "../db/catalog.js";

export const findProduct = (name: string) => {
  const found = products.find((item) => item.name === name);
  if (!found) throw new Error(`Товара «${name}» нет в сидах`);
  return found;
};

// тот же формат, что в приложении: цена в базе хранится в копейках
const formatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});
export const rubles = (kopecks: number) => formatter.format(kopecks / 100);

export interface CheckoutData {
  method: "delivery" | "pickup";
  name: string;
  phone: string;
  address?: string;
}

export const pickupData: CheckoutData = {
  method: "pickup",
  name: "Иван Иванов",
  phone: "+7 900 123-45-67",
};

export const deliveryData: CheckoutData = {
  method: "delivery",
  name: "Иван Иванов",
  phone: "+7 900 123-45-67",
  address: "г. Москва, ул. Тверская, д. 1, кв. 10",
};

/** Кладёт товары в корзину в localStorage ещё до загрузки приложения. */
export async function seedCart(
  page: Page,
  items: { productId: string; quantity: number }[],
) {
  await page.addInitScript((cart) => {
    localStorage.setItem("cart:v1", JSON.stringify({ state: { items: cart }, version: 0 }));
  }, items);
}

/**
 * Запрос от имени авторизованной страницы — через fetch в браузере.
 * Клиент page.request не отправляет Secure-куку по http (так в CI), браузер отправляет.
 */
export async function apiFetch(
  page: Page,
  method: "GET" | "POST",
  url: string,
  body?: unknown,
) {
  if (page.url() === "about:blank") await page.goto("/");

  return page.evaluate(
    async (args) => {
      const response = await fetch(args.url, {
        method: args.method,
        credentials: "same-origin",
        ...(args.body !== undefined && {
          headers: { "content-type": "application/json" },
          body: JSON.stringify(args.body),
        }),
      });
      return {
        status: response.status,
        body: (await response.json().catch(() => null)) as unknown,
      };
    },
    { method, url, body },
  );
}

export async function getProductId(request: APIRequestContext, name: string) {
  const response = await request.get("/api/products", {
    params: { search: name },
  });
  expect(response.status()).toBe(200);
  const page = (await response.json()) as {
    items: { id: string; name: string }[];
  };
  const found = page.items.find((item) => item.name === name);
  if (!found) throw new Error(`Товар «${name}» не найден через API`);
  return found.id;
}

export async function getStock(request: APIRequestContext, productId: string) {
  const response = await request.get(`/api/products/${productId}`);
  expect(response.status()).toBe(200);
  return ((await response.json()) as { stock: number }).stock;
}

/** Тело запроса на создание самовывозного заказа. Лишние поля передаются как есть. */
export const pickupOrderBody = (
  items: { productId: string; quantity: number }[],
  extra: Record<string, unknown> = {},
) => ({
  items,
  deliveryMethod: "pickup",
  recipientName: "Иван Иванов",
  recipientPhone: "+79001234567",
  ...extra,
});

export async function fillCheckoutForm(page: Page, data: CheckoutData) {
  await page.getByTestId("checkout-method").selectOption(data.method);
  await page.getByTestId("checkout-name").fill(data.name);
  await page.getByTestId("checkout-phone").fill(data.phone);
  if (data.address !== undefined) {
    await page.getByTestId("checkout-address").fill(data.address);
  }
}

export async function openProduct(page: Page, name: string) {
  await page.goto("/catalog");
  await page.getByTestId("filter-search").fill(name);
  const link = page.getByTestId("catalog-item-name").filter({ hasText: name });
  await expect(link).toHaveCount(1);
  await link.click();
  await expect(page.getByTestId("product-page")).toBeVisible();
}

/** Добавляет товар в корзину и открывает оформление заказа из корзины. */
export async function addToCartAndCheckout(page: Page, name: string) {
  await openProduct(page, name);
  await page.getByTestId("product-add-to-cart").click();
  await page.getByTestId("nav-cart").click();
  await expect(page.getByTestId("cart-page")).toBeVisible();
  await page.getByTestId("cart-checkout").click();
  await expect(page.getByTestId("checkout-page")).toBeVisible();
}
