import { db } from "#db/index.js";
import { UserRepository } from "#repository/index.js";
import { AuthService } from "#service/index.js";
import { createRouteHandlers } from "./routes/index.js";

const userRepository = new UserRepository(db);
const authService = new AuthService(userRepository);

export const serviceHandlers = createRouteHandlers({ authService });
