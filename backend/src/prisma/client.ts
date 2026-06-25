// Instancia unica de Prisma Client para acceder a la base de datos.
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
