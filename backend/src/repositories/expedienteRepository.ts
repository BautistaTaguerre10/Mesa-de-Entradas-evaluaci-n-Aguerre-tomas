// Repositorio de expedientes. Incluye consultas con organismo y personas vinculadas.
import type { Prisma } from "@prisma/client";
import { prisma } from "../prisma/client";

const expedienteInclude = {
  organismo: true,
  personas: {
    include: {
      persona: true,
      tipoVinculo: true,
    },
    orderBy: [{ esActorPrincipal: "desc" }, { id: "asc" }],
  },
} satisfies Prisma.ExpedienteInclude;

export class ExpedienteRepository {
  findAll(search?: string) {
    const args: Prisma.ExpedienteFindManyArgs = {
      include: expedienteInclude,
      orderBy: [{ anio: "desc" }, { numero: "desc" }],
    };

    if (search) {
      args.where = {
        OR: [
          { clave: { contains: search, mode: "insensitive" } },
          { caratula: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    return prisma.expediente.findMany(args);
  }

  findById(id: number) {
    return prisma.expediente.findUnique({
      where: { id },
      include: expedienteInclude,
    });
  }

  create(data: Prisma.ExpedienteCreateInput) {
    return prisma.expediente.create({ data, include: expedienteInclude });
  }

  async getNextNumero() {
    const [row] = await prisma.$queryRaw<Array<{ numero: bigint }>>`
      SELECT nextval('"Expediente_numero_seq"') AS numero
    `;

    if (!row) {
      throw new Error("No se pudo generar el numero del expediente");
    }

    return Number(row.numero);
  }

  update(id: number, data: Prisma.ExpedienteUpdateInput) {
    return prisma.expediente.update({ where: { id }, data, include: expedienteInclude });
  }

  delete(id: number) {
    return prisma.expediente.delete({ where: { id } });
  }

  replacePersonas(expedienteId: number, personas: Prisma.ExpedientePersonaCreateManyInput[]) {
    return prisma.$transaction(async (tx) => {
      await tx.expedientePersona.deleteMany({ where: { expedienteId } });
      if (personas.length > 0) {
        await tx.expedientePersona.createMany({ data: personas });
      }

      return tx.expediente.findUniqueOrThrow({
        where: { id: expedienteId },
        include: expedienteInclude,
      });
    });
  }
}
