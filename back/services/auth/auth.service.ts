import type { UserRepository } from "./auth.types.js";
import type { User, RegisterUserData } from "#domain/user/types.js";
import { passwordHasher } from "#lib/passwordHasher.js";

class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(userData: RegisterUserData): Promise<User> {
    const passwordHash = await passwordHasher.hash(userData.password);

    const user = await this.userRepository.createUser({
      email: userData.email,
      passwordHash,
    });
    return user;
  }

  async login(
    email: User["email"],
    password: string,
  ): Promise<User | undefined> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) return user;

    const isPasswordCorrect = await passwordHasher.verify(
      password,
      user.passwordHash,
    );
    if (!isPasswordCorrect) throw new Error("Incorrect password");

    return user;
  }
}

export default AuthService;
