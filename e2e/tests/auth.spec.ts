import type { Page } from "@playwright/test";
import { expect, test, type TestUser } from "../fixtures/users";

async function submitAuthForm(page: Page, { email, password }: TestUser) {
  await page.getByTestId("auth-email").fill(email);
  await page.getByTestId("auth-password").fill(password);
  await page.getByTestId("auth-submit").click();
}

test("новый пользователь регистрируется и оказывается авторизованным", async ({
  page,
  newUser,
}) => {
  await page.goto("/register");
  await submitAuthForm(page, newUser);

  await expect(page).toHaveURL("/");
  await expect(page.getByTestId("nav-signout")).toBeVisible();
  await expect(page.getByTestId("nav-signin")).toBeHidden();
});

test("зарегистрированный пользователь входит по своим email и паролю", async ({
  page,
  registeredUser,
}) => {
  await page.goto("/login");
  await submitAuthForm(page, registeredUser);

  await expect(page).toHaveURL("/");
  await expect(page.getByTestId("nav-signout")).toBeVisible();
});

test("после выхода защищенная страница перестает быть доступна", async ({
  page,
  authenticatedUser: _authenticatedUser,
}) => {
  await page.goto("/");
  await page.getByTestId("nav-signout").click();

  await expect(page).toHaveURL("/login");
  await expect(page.getByTestId("nav-signin")).toBeVisible();

  await page.goto("/");
  await expect(page).toHaveURL("/login");
});

test("регистрация с занятым email отклоняется с понятным сообщением", async ({
  page,
  registeredUser,
}) => {
  await page.goto("/register");
  await submitAuthForm(page, registeredUser);

  await expect(page.getByTestId("auth-error")).toHaveText(
    "Пользователь с таким email уже существует.",
  );
  await expect(page).toHaveURL("/register");
  await expect(page.getByTestId("nav-signout")).toBeHidden();
});

test("вход с неверным паролем отклоняется с понятным сообщением", async ({
  page,
  registeredUser,
}) => {
  await page.goto("/login");
  await submitAuthForm(page, {
    email: registeredUser.email,
    password: `${registeredUser.password}-wrong`,
  });

  await expect(page.getByTestId("auth-error")).toHaveText(
    "Неверный email или пароль.",
  );
  await expect(page).toHaveURL("/login");
  await expect(page.getByTestId("nav-signout")).toBeHidden();
});

test("после перезагрузки страницы пользователь остается авторизованным", async ({
  page,
  authenticatedUser: _authenticatedUser,
}) => {
  await page.goto("/");
  await expect(page.getByTestId("nav-signout")).toBeVisible();

  await page.reload();

  await expect(page).toHaveURL("/");
  await expect(page.getByTestId("nav-signout")).toBeVisible();
});

test("неавторизованный посетитель не попадает на защищенную страницу по прямому адресу", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page).toHaveURL("/login");
  await expect(page.getByText("Welcome Home!")).toBeHidden();
});
