import { expect, test } from "@playwright/test";

test("renders the main UI", async ({ page }) => {
  await page.goto("/login");
  await expect(page).toHaveTitle("Frontend app");
});
