// Middleware para responder 404 cuando una ruta no existe.
import type { RequestHandler } from "express";

export const notFoundMiddleware: RequestHandler = (_request, response) => {
  response.status(404).json({ message: "Ruta no encontrada" });
};
