// Seed inicial. Carga los tipos de vinculo obligatorios.
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tiposVinculo = ["ACTOR", "DEMANDADO", "CONDENADO", "VICTIMA"];

async function main() {
  for (const descripcion of tiposVinculo) {
    await prisma.tipoVinculo.upsert({
      where: { descripcion },
      update: {},
      create: { descripcion },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
