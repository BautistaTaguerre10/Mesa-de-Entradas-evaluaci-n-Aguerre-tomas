// Error propio de la aplicacion para controlar codigo HTTP y mensaje.
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}
