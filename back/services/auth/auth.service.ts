import type { CryptoUtils, UserRepository } from "./auth.types.js";
import type { User, RegisterUserData } from "#domain/user/types.js";
import type { SessionRepository } from "#repository/index.js";
import { UnauthorizedError } from "#lib/errors.js";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly cryptoUtils: CryptoUtils,
  ) {}

  async register(userData: RegisterUserData) {
    const passwordHash = await this.cryptoUtils.hash(userData.password);

    const user = await this.userRepository.createUser({
      email: userData.email,
      passwordHash,
    });
    return { user, tokenData: await this.createSession(user.id) };
  }

  async login(email: User["email"], password: string) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) throw new UnauthorizedError("Incorrect email or password");

    const isPasswordCorrect = await this.cryptoUtils.verify(
      password,
      user.passwordHash,
    );
    if (!isPasswordCorrect)
      throw new UnauthorizedError("Incorrect password or email");

    return { user, tokenData: await this.createSession(user.id) };
  }

  async logout(token: string) {
    const tokenHash = this.cryptoUtils.hashSessionToken(token);

    const sessionData = await this.sessionRepository.deleteSession(tokenHash);
    return sessionData;
  }

  async getCurrentUser(token: string) {
    const session = await this.validateSession(token);
    const user = await this.userRepository.getUserById(session.userId);

    if (!user) throw new UnauthorizedError("Invalid session user");

    return user;
  }

  private async createSession(userId: User["id"]) {
    const token = this.cryptoUtils.generateSessionToken();

    const session = await this.sessionRepository.createSession({
      userId,
      tokenHash: this.cryptoUtils.hashSessionToken(token),
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    });

    return { token, expiresAt: session.expiresAt };
  }

  async validateSession(token: string) {
    const session = await this.sessionRepository.getSessionByToken(
      this.cryptoUtils.hashSessionToken(token),
    );

    if (!session || session.expiresAt <= new Date()) {
      throw new UnauthorizedError("Invalid or expired session");
    }

    return session;
  }
}

export default AuthService;
