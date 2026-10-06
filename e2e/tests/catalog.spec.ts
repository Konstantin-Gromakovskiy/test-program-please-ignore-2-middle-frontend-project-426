import { expect, test, type Page } from "@playwright/test";
import { PAGE_SIZE, products } from "../db/catalog.js";

const TOTAL_PAGES = Math.ceil(products.length / PAGE_SIZE);

/** Сколько карточек должно быть на первой странице при данном числе подходящих товаров. */
const firstPageCount = (matches: number) => Math.min(matches, PAGE_SIZE);

const items = (page: Page) => page.getByTestId("catalog-item");

const itemNames = (page: Page) =>
  items(page).getByTestId("catalog-item-name").allTextContents();

const currentPage = (page: Page) =>
  new URL(page.url()).searchParams.get("page");

test.beforeEach(async ({ page }) => {
  await page.goto("/catalog");
  await expect(items(page)).toHaveCount(PAGE_SIZE);
});

test("каталог загружается, карточки товаров видны", async ({ page }) => {
  await expect(page.getByTestId("catalog-list")).toBeVisible();
  await expect(items(page).first()).toBeVisible();
});

test("в карточке есть название, цена и доступность", async ({ page }) => {
  const card = items(page).first();

  await expect(card.getByTestId("catalog-item-name")).not.toBeEmpty();
  await expect(card.getByTestId("catalog-item-price")).toContainText("₽");
  await expect(card.getByTestId("catalog-item-availability")).toHaveAttribute(
    "data-available",
    /^(true|false)$/,
  );
});

test("фильтр по категории сужает список", async ({ page }) => {
  const cpuProducts = products.filter(({ categorySlug }) => categorySlug === "cpu");

  await page.getByTestId("filter-category").selectOption("cpu");

  await expect(items(page)).toHaveCount(firstPageCount(cpuProducts.length));
  expect((await itemNames(page)).sort()).toEqual(
    cpuProducts.map(({ name }) => name).sort(),
  );
});

test("поиск по части названия оставляет в выдаче подходящий товар", async ({
  page,
}) => {
  await page.getByTestId("filter-search").fill("7800x3d");

  await expect(items(page)).toHaveCount(1);
  await expect(items(page).getByTestId("catalog-item-name")).toHaveText(
    "AMD Ryzen 7 7800X3D",
  );
});

test("фильтр по цене меняет состав выдачи", async ({ page }) => {
  const maxRubles = 5000;
  const cheap = products.filter(
    ({ price }) => price <= maxRubles * 100,
  );

  await page.getByTestId("filter-price-max").fill(String(maxRubles));

  await expect(items(page)).toHaveCount(firstPageCount(cheap.length));
  expect((await itemNames(page)).sort()).toEqual(
    cheap.map(({ name }) => name).sort(),
  );

  const minRubles = 100000;
  const expensive = products.filter(
    ({ price }) => price >= minRubles * 100,
  );
  await page.getByTestId("filter-price-max").clear();
  await page.getByTestId("filter-price-min").fill(String(minRubles));

  await expect(items(page)).toHaveCount(firstPageCount(expensive.length));
  await expect(items(page).first().getByTestId("catalog-item-price")).toContainText(
    /\d/,
  );
});

test("сброс фильтров возвращает полный список", async ({ page }) => {
  await page.getByTestId("filter-category").selectOption("cpu");
  await page.getByTestId("filter-search").fill("ryzen");
  await expect(items(page)).toHaveCount(3);

  await page.getByTestId("filter-reset").click();

  await expect(items(page)).toHaveCount(PAGE_SIZE);
  await expect(page.getByTestId("filter-category")).toHaveValue("");
  await expect(page.getByTestId("filter-search")).toHaveValue("");
  await expect(page.getByTestId("filter-price-min")).toHaveValue("");
  await expect(page.getByTestId("filter-price-max")).toHaveValue("");
  await expect(page.getByTestId("filter-available")).not.toBeChecked();
});

test("комбинация фильтров без результатов показывает пустое состояние", async ({
  page,
}) => {
  await page.getByTestId("filter-category").selectOption("cpu");
  await page.getByTestId("filter-search").fill("RTX");

  await expect(page.getByTestId("catalog-empty")).toBeVisible();
  await expect(page.getByTestId("catalog-list")).toBeHidden();
});

test("переход на следующую страницу меняет набор карточек", async ({
  page,
}) => {
  const firstPage = await itemNames(page);

  await page.getByTestId("catalog-page-next").click();

  await expect(page).toHaveURL(/page=2/);
  await expect(items(page)).toHaveCount(PAGE_SIZE);
  const secondPage = await itemNames(page);
  expect(secondPage).not.toEqual(firstPage);
  expect(secondPage.filter((name) => firstPage.includes(name))).toEqual([]);

  await page.getByTestId("catalog-page-next").click();

  await expect(page).toHaveURL(new RegExp(`page=${TOTAL_PAGES}`));
  await expect(items(page)).toHaveCount(products.length - PAGE_SIZE * 2);
  await expect(page.getByTestId("catalog-page-next")).toBeDisabled();
});

test("смена фильтра возвращает на первую страницу выдачи", async ({ page }) => {
  await page.getByTestId("catalog-page-next").click();
  await expect(page).toHaveURL(/page=2/);

  await page.getByTestId("filter-category").selectOption("ram");

  await expect(page).toHaveURL(/categorySlug=ram/);
  expect(currentPage(page)).toBe("1");
  await expect(items(page).first()).toBeVisible();
});

test("на первой странице «назад» не уводит в несуществующую страницу", async ({
  page,
}) => {
  const before = await itemNames(page);
  const prev = page.getByTestId("catalog-page-prev");

  await expect(prev).toBeDisabled();
  await prev.click({ force: true });

  expect(currentPage(page)).not.toBe("0");
  expect(Number(currentPage(page) ?? 1)).toBe(1);
  await expect(items(page)).toHaveCount(PAGE_SIZE);
  expect(await itemNames(page)).toEqual(before);
});

test("перезагрузка страницы с выбранным фильтром сохраняет выдачу и значения контролов", async ({
  page,
}) => {
  const gpuInStock = products.filter(
    ({ categorySlug, stock }) => categorySlug === "gpu" && stock > 0,
  );

  await page.getByTestId("filter-category").selectOption("gpu");
  await page.getByTestId("filter-available").check();
  await page.getByTestId("filter-price-min").fill("20000");
  await expect(page).toHaveURL(/categorySlug=gpu/);
  await expect(page).toHaveURL(/inStockOnly=true/);
  await expect(page).toHaveURL(/minPrice=20000/);

  const expected = gpuInStock.filter(({ price }) => price >= 20000 * 100);
  await expect(items(page)).toHaveCount(firstPageCount(expected.length));
  const before = (await itemNames(page)).sort();

  await page.reload();

  await expect(page.getByTestId("filter-category")).toHaveValue("gpu");
  await expect(page.getByTestId("filter-available")).toBeChecked();
  await expect(page.getByTestId("filter-price-min")).toHaveValue("20000");
  await expect(items(page)).toHaveCount(firstPageCount(expected.length));
  expect((await itemNames(page)).sort()).toEqual(before);
});

test("«назад» после смены фильтра возвращает предыдущую выдачу", async ({
  page,
}) => {
  const before = await itemNames(page);

  await page.getByTestId("filter-category").selectOption("cpu");
  await expect(page).toHaveURL(/categorySlug=cpu/);
  await expect(items(page)).toHaveCount(
    products.filter(({ categorySlug }) => categorySlug === "cpu").length,
  );

  await page.goBack();

  await expect(page).not.toHaveURL(/categorySlug=/);
  await expect(items(page)).toHaveCount(PAGE_SIZE);
  expect(await itemNames(page)).toEqual(before);
});

test("слово, набранное в поиск без пауз, отправляет один запрос каталога", async ({
  page,
}) => {
  const searchRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.pathname === "/api/products" && url.searchParams.has("search")) {
      searchRequests.push(url.search);
    }
  });

  await page.getByTestId("filter-search").pressSequentially("ryzen", {
    delay: 0,
  });

  await expect(items(page)).toHaveCount(3);
  // даем время на возможные лишние запросы после дебаунса
  await page.waitForTimeout(1000);
  expect(searchRequests).toHaveLength(1);
  expect(searchRequests[0]).toContain("search=ryzen");
});

test.describe("мобильный экран", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("у каталога нет горизонтальной прокрутки", async ({ page }) => {
    await expect(page.getByTestId("catalog-pagination")).toBeVisible();

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
  });
});

test.describe("невалидный параметр каталога", () => {
  const invalidQueries = [
    "page=0",
    "page=abc",
    "pageSize=0",
    "pageSize=101",
    "minPrice=-1",
    "maxPrice=abc",
    "availability=unknown",
  ];

  for (const query of invalidQueries) {
    test(`/api/products?${query} получает ответ 400`, async ({ request }) => {
      const response = await request.get(`/api/products?${query}`);

      expect(response.status()).toBe(400);
    });
  }
});
