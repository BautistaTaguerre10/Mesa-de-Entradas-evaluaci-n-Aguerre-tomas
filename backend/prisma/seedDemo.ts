// Seed demo. Carga datos de prueba para verificar listados, filtros y estadisticas.
import "dotenv/config";
import { Ciudad, Fuero, PrismaClient, TipoExpediente } from "@prisma/client";

const prisma = new PrismaClient();

const personas = [
  ["30111222", "Acuña", "Mariela"],
  ["28444555", "Benitez", "Carlos"],
  ["33666777", "Castro", "Luciana"],
  ["25777888", "Dominguez", "Pablo"],
  ["31222999", "Espinosa", "Valeria"],
  ["29888111", "Fernandez", "Diego"],
  ["34555222", "Garcia", "Natalia"],
  ["27666333", "Herrera", "Sofia"],
  ["32111444", "Ibarra", "Martin"],
  ["30999555", "Juarez", "Paula"],
  ["35888666", "Lagos", "Agustin"],
  ["26777777", "Molina", "Gabriela"],
  ["33444888", "Navarro", "Rocio"],
  ["28999999", "Ortega", "Sergio"],
  ["31666123", "Paredes", "Camila"],
  ["35444234", "Quiroga", "Emiliano"],
  ["27333345", "Rivas", "Andrea"],
  ["32222456", "Sosa", "Federico"],
  ["29666567", "Torres", "Marina"],
  ["33777678", "Uribe", "Javier"],
  ["30555789", "Vega", "Laura"],
  ["28444890", "Walter", "Bruno"],
  ["34999101", "Yañez", "Patricia"],
  ["26333212", "Zapata", "Miguel"],
  ["37111323", "Alvarez", "Noelia"],
  ["38111434", "Bustos", "Ramiro"],
  ["39111545", "Carrizo", "Elena"],
  ["40111656", "Diaz", "Tomas"],
  ["41111767", "Escobar", "Julieta"],
  ["42111878", "Figueroa", "Nicolas"],
] as const;

const organismos = [
  { codigo: "JNQEJ", nombre: "Juzgado Ejecutivo Nro. 1", caratulaTitulo: "Mesa Ejecutiva Neuquén", ciudad: Ciudad.NEUQUEN, fuero: Fuero.EJECUTIVOS },
  { codigo: "JNQCI", nombre: "Juzgado Civil Nro. 2", caratulaTitulo: "Mesa Civil Neuquén", ciudad: Ciudad.NEUQUEN, fuero: Fuero.CIVIL },
  { codigo: "JNQLA", nombre: "Juzgado Laboral Nro. 1", caratulaTitulo: "Mesa Laboral Neuquén", ciudad: Ciudad.NEUQUEN, fuero: Fuero.LABORAL },
  { codigo: "JNQFA", nombre: "Juzgado de Familia Nro. 1", caratulaTitulo: "Mesa Familia Neuquén", ciudad: Ciudad.NEUQUEN, fuero: Fuero.FAMILIA },
  { codigo: "JZAEJ", nombre: "Juzgado Ejecutivo Zapala", caratulaTitulo: "Mesa Ejecutiva Zapala", ciudad: Ciudad.ZAPALA, fuero: Fuero.EJECUTIVOS },
  { codigo: "JZACI", nombre: "Juzgado Civil Zapala", caratulaTitulo: "Mesa Civil Zapala", ciudad: Ciudad.ZAPALA, fuero: Fuero.CIVIL },
  { codigo: "JZAFA", nombre: "Juzgado de Familia Zapala", caratulaTitulo: "Mesa Familia Zapala", ciudad: Ciudad.ZAPALA, fuero: Fuero.FAMILIA },
  { codigo: "JJUEJ", nombre: "Juzgado Ejecutivo Junín", caratulaTitulo: "Mesa Ejecutiva Junín", ciudad: Ciudad.JUNIN_DE_LOS_ANDES, fuero: Fuero.EJECUTIVOS },
  { codigo: "JJUCI", nombre: "Juzgado Civil Junín", caratulaTitulo: "Mesa Civil Junín", ciudad: Ciudad.JUNIN_DE_LOS_ANDES, fuero: Fuero.CIVIL },
  { codigo: "JJULA", nombre: "Juzgado Laboral Junín", caratulaTitulo: "Mesa Laboral Junín", ciudad: Ciudad.JUNIN_DE_LOS_ANDES, fuero: Fuero.LABORAL },
] as const;

const asuntos = [
  "daños y perjuicios",
  "ordinario",
  "cobro ejecutivo",
  "amparo",
  "alimentos",
  "despido",
  "sucesión ab intestato",
  "división de bienes",
  "acción procesal administrativa",
  "ejecución de sentencia",
] as const;

function formatPersona(persona: { apellido: string; nombre: string }) {
  return `${persona.apellido} ${persona.nombre}`;
}

async function main() {
  await prisma.tipoVinculo.createMany({
    data: ["ACTOR", "DEMANDADO", "CONDENADO", "VICTIMA"].map((descripcion) => ({ descripcion })),
    skipDuplicates: true,
  });

  const tipos = await prisma.tipoVinculo.findMany();
  const tipoByDescripcion = Object.fromEntries(tipos.map((tipo) => [tipo.descripcion, tipo.id]));

  for (const [dni, apellido, nombre] of personas) {
    await prisma.persona.upsert({
      where: { dni },
      update: { apellido, nombre },
      create: { dni, apellido, nombre },
    });
  }

  for (const organismo of organismos) {
    await prisma.organismo.upsert({
      where: { codigo: organismo.codigo },
      update: organismo,
      create: organismo,
    });
  }

  const personasDb = await prisma.persona.findMany({ orderBy: { id: "asc" } });

  for (let index = 0; index < 50; index += 1) {
    const organismo = organismos[index % organismos.length]!;
    const tipo = index % 5 === 0 ? TipoExpediente.LEG : TipoExpediente.EXP;
    const anio = 2022 + (index % 5);
    const numero = index + 1;
    const clave = `${organismo.codigo} ${tipo} ${numero}/${anio}`;
    const actorPersona = personasDb[index % personasDb.length]!;
    const demandadoPersona = personasDb[(index + 7) % personasDb.length]!;
    const segundoVinculoPersona = personasDb[(index + 13) % personasDb.length]!;
    const segundoVinculo = index % 2 === 0 ? "VICTIMA" : "CONDENADO";
    const asunto = asuntos[index % asuntos.length]!;
    const caratula = `${formatPersona(actorPersona)} c/ ${formatPersona(demandadoPersona)} s/ ${asunto}`;

    const expediente = await prisma.expediente.upsert({
      where: { clave },
      update: {
        codigoOrganismo: organismo.codigo,
        tipo,
        numero,
        anio,
        caratula,
        ciudad: organismo.ciudad,
      },
      create: {
        codigoOrganismo: organismo.codigo,
        tipo,
        numero,
        anio,
        caratula,
        ciudad: organismo.ciudad,
        clave,
      },
    });

    await prisma.expedientePersona.deleteMany({ where: { expedienteId: expediente.id } });
    await prisma.expedientePersona.createMany({
      data: [
        {
          expedienteId: expediente.id,
          personaId: actorPersona.id,
          tipoVinculoId: tipoByDescripcion.ACTOR!,
          esActorPrincipal: true,
        },
        {
          expedienteId: expediente.id,
          personaId: demandadoPersona.id,
          tipoVinculoId: tipoByDescripcion.DEMANDADO!,
          esActorPrincipal: false,
        },
        {
          expedienteId: expediente.id,
          personaId: segundoVinculoPersona.id,
          tipoVinculoId: tipoByDescripcion[segundoVinculo]!,
          esActorPrincipal: false,
        },
      ],
    });
  }

  await prisma.$executeRaw`
    SELECT setval(
      '"Expediente_numero_seq"',
      GREATEST(COALESCE((SELECT MAX("numero") FROM "Expediente"), 0), 1),
      COALESCE((SELECT MAX("numero") FROM "Expediente"), 0) > 0
    )
  `;
}

main()
  .then(async () => {
    console.log("Datos demo cargados con numeracion automatica global.");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
