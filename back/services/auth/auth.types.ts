import type { NewUser, User } from "#domain/user/types.js";

export interface UserRepository {
  createUser(userData: NewUser): Promise<User>;
  getUserByEmail(email: User["email"]): Promise<User | undefined>;
}
