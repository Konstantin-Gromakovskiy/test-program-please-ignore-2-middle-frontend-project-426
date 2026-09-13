import { expect, test } from '@playwright/test'

test('renders the main UI', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('front')
})

