// Validadores reutilizables para parametros y consultas HTTP.
import { z } from "zod";

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const paginationQuerySchema = z.object({
  search: z.string().optional(),
});
