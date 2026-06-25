// Servicio de personas. Valida datos y evita borrar personas con expedientes.
import { z } from "zod";
import { PersonaRepository } from "../repositories/personaRepository";
import { AppError } from "../utils/appError";

const personaSchema = z.object({
  dni: z.string().trim().min(6).max(12),
  apellido: z.string().trim().min(1).max(120),
  nombre: z.string().trim().min(1).max(120),
});

export type PersonaInput = z.infer<typeof personaSchema>;

export class PersonaService {
  constructor(private readonly repository = new PersonaRepository()) {}

  list(search?: string) {
    return this.repository.findAll(search);
  }

  async get(id: number) {
    const persona = await this.repository.findById(id);
    if (!persona) {
      throw new AppError(404, "Persona no encontrada");
    }
    return persona;
  }

  async listExpedientes(id: number) {
    await this.get(id);
    return this.repository.findExpedientes(id);
  }

  create(input: unknown) {
    const data = personaSchema.parse(input);
    return this.repository.create(data);
  }

  update(id: number, input: unknown) {
    const data = personaSchema.parse(input);
    return this.repository.update(id, data);
  }

  async delete(id: number) {
    await this.get(id);
    const expedientesCount = await this.repository.countExpedientes(id);

    if (expedientesCount > 0) {
      throw new AppError(
        409,
        `No se puede eliminar la persona porque participa en ${expedientesCount} expediente(s). Quite primero sus vinculos desde Expedientes.`,
      );
    }

    return this.repository.delete(id);
  }
}
