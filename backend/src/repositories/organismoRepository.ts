// Repositorio de organismos. Encapsula consultas Prisma del modulo Organismo.
import type { Prisma } from "@prisma/client";
import { prisma } from "../prisma/client";

export class OrganismoRepository {
  findAll(search?: string) {
    const args: Prisma.OrganismoFindManyArgs = {
      orderBy: { codigo: "asc" },
    };

    if (search) {
      args.where = {
        OR: [
          { codigo: { contains: search, mode: "insensitive" } },
          { nombre: { contains: search, mode: "insensitive" } },
          { caratulaTitulo: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    return prisma.organismo.findMany(args);
  }

  findById(id: number) {
    return prisma.organismo.findUnique({ where: { id } });
  }

  findByCodigo(codigo: string) {
    return prisma.organismo.findUnique({ where: { codigo } });
  }

  create(data: Prisma.OrganismoCreateInput) {
    return prisma.organismo.create({ data });
  }

  update(id: number, data: Prisma.OrganismoUpdateInput) {
    return prisma.organismo.update({ where: { id }, data });
  }

  delete(id: number) {
    return prisma.organismo.delete({ where: { id } });
  }
}
