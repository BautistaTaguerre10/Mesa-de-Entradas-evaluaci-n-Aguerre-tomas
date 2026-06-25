// Servicio de expedientes. Aplica reglas de clave, ciudad y actor principal.
import { Ciudad, TipoExpediente } from "@prisma/client";
import { z } from "zod";
import { ExpedienteRepository } from "../repositories/expedienteRepository";
import { OrganismoRepository } from "../repositories/organismoRepository";
import { TipoVinculoRepository } from "../repositories/tipoVinculoRepository";
import { AppError } from "../utils/appError";
import { buildExpedienteClave } from "../utils/catalogs";

const expedientePersonaSchema = z.object({
  personaId: z.coerce.number().int().positive(),
  tipoVinculoId: z.coerce.number().int().positive(),
  esActorPrincipal: z.boolean().default(false),
});

const expedienteSchema = z.object({
  codigoOrganismo: z.string().trim().toUpperCase().regex(/^J[A-Z]{4}$/),
  tipo: z.nativeEnum(TipoExpediente),
  numero: z.coerce.number().int().positive().optional(),
  anio: z.coerce.number().int().min(1900).max(2200),
  caratula: z.string().trim().min(1).max(300),
  ciudad: z.nativeEnum(Ciudad),
  personas: z.array(expedientePersonaSchema).min(1),
});

const expedienteUpdateSchema = z.object({
  caratula: z.string().trim().min(1).max(300),
  personas: z.array(expedientePersonaSchema).min(1).optional(),
});

type ExpedienteInput = z.infer<typeof expedienteSchema>;
type ExpedienteUpdateInput = z.infer<typeof expedienteUpdateSchema>;

export class ExpedienteService {
  constructor(
    private readonly repository = new ExpedienteRepository(),
    private readonly organismoRepository = new OrganismoRepository(),
    private readonly tipoVinculoRepository = new TipoVinculoRepository(),
  ) {}

  list(search?: string) {
    return this.repository.findAll(search);
  }

  async get(id: number) {
    const expediente = await this.repository.findById(id);
    if (!expediente) {
      throw new AppError(404, "Expediente no encontrado");
    }
    return expediente;
  }

  async create(input: unknown) {
    const data = expedienteSchema.parse(input);
    await this.validatePersonas(data.personas);

    const organismo = await this.organismoRepository.findByCodigo(data.codigoOrganismo);
    if (!organismo) {
      throw new AppError(404, "Organismo no encontrado");
    }

    if (data.ciudad !== organismo.ciudad) {
      throw new AppError(400, "La ciudad del expediente debe coincidir con la ciudad del organismo");
    }

    const numero = await this.repository.getNextNumero();
    const clave = buildExpedienteClave(organismo.codigo, data.tipo, numero, data.anio);

    return this.repository.create({
      organismo: { connect: { codigo: data.codigoOrganismo } },
      tipo: data.tipo,
      numero,
      anio: data.anio,
      caratula: data.caratula,
      ciudad: data.ciudad,
      clave,
      personas: {
        create: data.personas.map((persona) => ({
          persona: { connect: { id: persona.personaId } },
          tipoVinculo: { connect: { id: persona.tipoVinculoId } },
          esActorPrincipal: persona.esActorPrincipal,
        })),
      },
    });
  }

  async update(id: number, input: unknown) {
    await this.get(id);
    const data = expedienteUpdateSchema.parse(input);
    const expediente = await this.repository.update(id, {
      caratula: data.caratula,
    });

    if (data.personas) {
      await this.validatePersonas(data.personas);
      return this.repository.replacePersonas(
        id,
        data.personas.map((persona) => ({
          expedienteId: id,
          personaId: persona.personaId,
          tipoVinculoId: persona.tipoVinculoId,
          esActorPrincipal: persona.esActorPrincipal,
        })),
      );
    }

    return expediente;
  }

  delete(id: number) {
    return this.repository.delete(id);
  }

  private async validatePersonas(personas: ExpedienteInput["personas"] | ExpedienteUpdateInput["personas"]) {
    if (!personas) {
      return;
    }

    const principales = personas.filter((persona) => persona.esActorPrincipal);
    if (principales.length !== 1) {
      throw new AppError(400, "Todo expediente debe tener exactamente un actor principal");
    }

    const personasUnicas = new Set(personas.map((persona) => persona.personaId));
    if (personasUnicas.size !== personas.length) {
      throw new AppError(400, "Una persona no puede tener mas de un vinculo dentro del mismo expediente");
    }

    const actor = await this.tipoVinculoRepository.findByDescripcion("ACTOR");
    if (!actor) {
      throw new AppError(500, "Falta el tipo de vinculo ACTOR. Ejecute el seed inicial.");
    }

    if (principales[0]?.tipoVinculoId !== actor.id) {
      throw new AppError(400, "El actor principal debe tener vinculo ACTOR");
    }
  }
}
