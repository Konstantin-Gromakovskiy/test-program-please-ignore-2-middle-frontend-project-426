import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

export const cryptoUtils = {
  generateRandomHex(bytes: number): string {
    return randomBytes(bytes).toString("hex");
  },

  generateSessionToken(): string {
    return this.generateRandomHex(32);
  },

  hashSessionToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  },

  async hash(password: string): Promise<string> {
    const salt = this.generateRandomHex(16);

    const hash = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${salt}:${hash.toString("hex")}`;
  },

  async verify(password: string, storedHash: string): Promise<boolean> {
    const [salt, hash] = storedHash.split(":");

    if (!salt || !hash) {
      throw new Error("Invalid stored hash");
    }

    const expectedHash = Buffer.from(hash, "hex");

    const actualHash = (await scryptAsync(password, salt, 64)) as Buffer;

    return timingSafeEqual(expectedHash, actualHash);
  },
};
