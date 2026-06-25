// Middleware centralizado para transformar errores en respuestas HTTP claras.
import type { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "../utils/appError";

export const errorMiddleware: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    });
  }

  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Datos invalidos",
      details: error.flatten(),
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return response.status(409).json({
        message: "Ya existe un registro con esos datos unicos",
        details: error.meta,
      });
    }

    if (error.code === "P2025") {
      return response.status(404).json({ message: "Registro no encontrado" });
    }
  }

  console.error(error);
  return response.status(500).json({ message: "Error interno del servidor" });
};
