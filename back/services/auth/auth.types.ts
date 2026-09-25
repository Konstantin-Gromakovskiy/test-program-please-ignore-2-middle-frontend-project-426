import type { NewUser, User } from "#domain/user/types.js";

export interface UserRepository {
  createUser(userData: NewUser): Promise<User>;
  getUserByEmail(email: User["email"]): Promise<User | undefined>;
  getUserById(id: User["id"]): Promise<User | undefined>;
}

export interface CryptoUtils {
  generateRandomHex(bytes: number): string;
  generateSessionToken(): string;
  hashSessionToken(token: string): string;
  hash(password: string): Promise<string>;
  verify(password: string, storedHash: string): Promise<boolean>;
}
