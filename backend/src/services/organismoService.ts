// Servicio de organismos. Valida formato y coherencia del codigo.
import { Ciudad, Fuero } from "@prisma/client";
import { z } from "zod";
import { OrganismoRepository } from "../repositories/organismoRepository";
import { AppError } from "../utils/appError";
import { buildOrganismoCodigo } from "../utils/catalogs";

const organismoSchema = z.object({
  codigo: z.string().trim().toUpperCase().regex(/^J[A-Z]{4}$/),
  nombre: z.string().trim().min(1).max(180),
  caratulaTitulo: z.string().trim().min(1).max(300),
  ciudad: z.nativeEnum(Ciudad),
  fuero: z.nativeEnum(Fuero),
});

const organismoUpdateSchema = z.object({
  nombre: z.string().trim().min(1).max(180),
  caratulaTitulo: z.string().trim().min(1).max(300),
});

export class OrganismoService {
  constructor(private readonly repository = new OrganismoRepository()) {}

  list(search?: string) {
    return this.repository.findAll(search);
  }

  async get(id: number) {
    const organismo = await this.repository.findById(id);
    if (!organismo) {
      throw new AppError(404, "Organismo no encontrado");
    }
    return organismo;
  }

  create(input: unknown) {
    const data = this.parseAndValidate(input);
    return this.repository.create(data);
  }

  update(id: number, input: unknown) {
    const data = organismoUpdateSchema.parse(input);
    return this.repository.update(id, data);
  }

  delete(id: number) {
    return this.repository.delete(id);
  }

  private parseAndValidate(input: unknown) {
    const data = organismoSchema.parse(input);
    const expectedCode = buildOrganismoCodigo(data.ciudad, data.fuero);

    if (data.codigo !== expectedCode) {
      throw new AppError(400, `El codigo debe ser ${expectedCode} para la ciudad y fuero indicados`);
    }

    return data;
  }
}
