import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

export const passwordHasher = {
  async hash(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");

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
