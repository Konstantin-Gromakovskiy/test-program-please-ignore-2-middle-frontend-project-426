export type User = {
  id: string;
  email: string;
  passwordHash: string;
};

export type NewUser = {
  email: string;
  passwordHash: string;
};

export type RegisterUserData = {
  email: string;
  password: string;
};
