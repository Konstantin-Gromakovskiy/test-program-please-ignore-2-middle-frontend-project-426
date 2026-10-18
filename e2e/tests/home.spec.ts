import { expect, test } from "@playwright/test";
import { promos } from "../db/catalog.js";

test("главная показывает заголовок, подзаголовок и кнопку каталога", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByTestId("home-title")).toHaveText(
    "Комплектующие для ПК с доставкой по городу",
  );
  await expect(page.getByTestId("home-subtitle")).toHaveText(
    "Видеокарты, процессоры и материнские платы в наличии. Собираем подборки под задачу.",
  );
  await expect(page.getByTestId("home-catalog-link")).toHaveText(
    "Перейти в каталог",
  );
});

test("кнопка «Перейти в каталог» ведёт в каталог", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("home-catalog-link").click();

  await expect(page).toHaveURL(/\/catalog/);
  await expect(page.getByTestId("catalog-list")).toBeVisible();
});

test("«Выбор магазина» показывает промо из базы в заданном порядке", async ({
  page,
}) => {
  await page.goto("/");

  const section = page.getByTestId("home-promo");
  await expect(section).toBeVisible();
  await expect(section.getByRole("heading", { name: "Выбор магазина" })).toBeVisible();

  const items = page.getByTestId("home-promo-item");
  await expect(items).toHaveCount(promos.length);
  await expect(page.getByTestId("home-promo-title")).toHaveText(
    promos.map((promo) => promo.title),
  );
  await expect(page.getByTestId("home-promo-product")).toHaveText(
    promos.map((promo) => promo.productName),
  );
});

test("промо ведёт на страницу товара, который можно добавить в корзину", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByTestId("home-promo-item").first().click();

  await expect(page).toHaveURL(/\/products\/.+/);
  await expect(page.getByTestId("product-name")).toHaveText(
    promos[0].productName,
  );
  await expect(page.getByTestId("product-price")).not.toBeEmpty();
  await expect(page.getByTestId("product-add-to-cart")).toBeEnabled();
});

test("API промо отдаёт только товары в наличии", async ({ request }) => {
  const response = await request.get("/api/promos");

  expect(response.status()).toBe(200);
  const items = (await response.json()) as {
    title: string;
    product: { stock: number };
  }[];
  expect(items.length).toBeGreaterThan(1);
  expect(items.every((promo) => promo.product.stock > 0)).toBe(true);
});

test.describe("мобильный экран", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("у главной нет горизонтальной прокрутки", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("home-promo-item").first()).toBeVisible();

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );

    expect(overflow).toBeLessThanOrEqual(0);
  });
});
