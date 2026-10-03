import { expect, test as base } from "@playwright/test";

export interface TestUser {
  email: string;
  password: string;
}

interface UserFixtures {
  /** Уникальные данные нового пользователя. В базе его нет. */
  newUser: TestUser;
  /** Пользователь, зарегистрированный через API. Страница не авторизована. */
  registeredUser: TestUser;
  /** Пользователь, зарегистрированный через API. Страница уже авторизована. */
  authenticatedUser: TestUser;
}

let counter = 0;

function createUser(): TestUser {
  counter += 1;
  return {
    email: `user-${Date.now()}-${counter}@test.com`,
    password: "12345678",
  };
}

export const test = base.extend<UserFixtures>({
  newUser: async ({}, use) => {
    await use(createUser());
  },

  registeredUser: async ({ playwright, baseURL }, use) => {
    const user = createUser();
    // отдельный контекст, чтобы кука сессии не попала в страницу теста
    const api = await playwright.request.newContext({ baseURL });
    const response = await api.post("/api/auth/register", { data: user });
    expect(response.status()).toBe(201);
    await api.dispose();

    await use(user);
  },

  authenticatedUser: async ({ context }, use) => {
    const user = createUser();
    // context.request делит куки с браузерным контекстом страницы
    const response = await context.request.post("/api/auth/register", {
      data: user,
    });
    expect(response.status()).toBe(201);

    await use(user);
  },
});

export { expect };
