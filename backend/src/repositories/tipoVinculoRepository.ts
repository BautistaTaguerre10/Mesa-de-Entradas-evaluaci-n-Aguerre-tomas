// Repositorio de tipos de vinculo. Consulta el catalogo de vinculos.
import { prisma } from "../prisma/client";

export class TipoVinculoRepository {
  findAll() {
    return prisma.tipoVinculo.findMany({ orderBy: { descripcion: "asc" } });
  }

  findById(id: number) {
    return prisma.tipoVinculo.findUnique({ where: { id } });
  }

  findByDescripcion(descripcion: string) {
    return prisma.tipoVinculo.findUnique({ where: { descripcion } });
  }
}
