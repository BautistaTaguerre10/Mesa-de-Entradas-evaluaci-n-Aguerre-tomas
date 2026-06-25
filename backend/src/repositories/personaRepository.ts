// Repositorio de personas. Encapsula consultas Prisma del modulo Persona.
import type { Prisma } from "@prisma/client";
import { prisma } from "../prisma/client";

export class PersonaRepository {
  findAll(search?: string) {
    const args: Prisma.PersonaFindManyArgs = {
      orderBy: [{ apellido: "asc" }, { nombre: "asc" }],
    };

    if (search) {
      args.where = {
        OR: [
          { dni: { contains: search, mode: "insensitive" } },
          { apellido: { contains: search, mode: "insensitive" } },
          { nombre: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    return prisma.persona.findMany(args);
  }

  findById(id: number) {
    return prisma.persona.findUnique({ where: { id } });
  }

  findExpedientes(id: number) {
    return prisma.expediente.findMany({
      where: {
        personas: {
          some: {
            personaId: id,
          },
        },
      },
      include: {
        organismo: true,
        personas: {
          where: {
            personaId: id,
          },
          include: {
            persona: true,
            tipoVinculo: true,
          },
        },
      },
      orderBy: [{ anio: "desc" }, { numero: "desc" }],
    });
  }

  countExpedientes(id: number) {
    return prisma.expedientePersona.count({ where: { personaId: id } });
  }

  create(data: Prisma.PersonaCreateInput) {
    return prisma.persona.create({ data });
  }

  update(id: number, data: Prisma.PersonaUpdateInput) {
    return prisma.persona.update({ where: { id }, data });
  }

  delete(id: number) {
    return prisma.persona.delete({ where: { id } });
  }
}
