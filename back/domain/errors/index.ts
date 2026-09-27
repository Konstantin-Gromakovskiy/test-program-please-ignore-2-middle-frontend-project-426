export class UniqueConstraintError extends Error {
  constructor(message = "A unique constraint was violated") {
    super(message);
    this.name = "UniqueConstraintError";
  }
}
