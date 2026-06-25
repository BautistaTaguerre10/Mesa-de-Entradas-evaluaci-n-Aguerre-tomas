CREATE TYPE "Ciudad" AS ENUM ('NEUQUEN', 'ZAPALA', 'JUNIN_DE_LOS_ANDES');
CREATE TYPE "Fuero" AS ENUM ('EJECUTIVOS', 'CIVIL', 'LABORAL', 'FAMILIA');
CREATE TYPE "TipoExpediente" AS ENUM ('EXP', 'LEG');

CREATE TABLE "Persona" (
  "id" SERIAL NOT NULL,
  "dni" TEXT NOT NULL,
  "apellido" TEXT NOT NULL,
  "nombre" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Persona_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Organismo" (
  "id" SERIAL NOT NULL,
  "codigo" TEXT NOT NULL,
  "nombre" TEXT NOT NULL,
  "caratulaTitulo" TEXT NOT NULL,
  "ciudad" "Ciudad" NOT NULL,
  "fuero" "Fuero" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Organismo_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Expediente" (
  "id" SERIAL NOT NULL,
  "codigoOrganismo" TEXT NOT NULL,
  "tipo" "TipoExpediente" NOT NULL,
  "numero" INTEGER NOT NULL,
  "anio" INTEGER NOT NULL,
  "caratula" TEXT NOT NULL,
  "ciudad" "Ciudad" NOT NULL,
  "clave" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Expediente_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TipoVinculo" (
  "id" SERIAL NOT NULL,
  "descripcion" TEXT NOT NULL,
  CONSTRAINT "TipoVinculo_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ExpedientePersona" (
  "id" SERIAL NOT NULL,
  "expedienteId" INTEGER NOT NULL,
  "personaId" INTEGER NOT NULL,
  "tipoVinculoId" INTEGER NOT NULL,
  "esActorPrincipal" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ExpedientePersona_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Persona_dni_key" ON "Persona"("dni");
CREATE UNIQUE INDEX "Organismo_codigo_key" ON "Organismo"("codigo");
CREATE UNIQUE INDEX "Expediente_clave_key" ON "Expediente"("clave");
CREATE UNIQUE INDEX "Expediente_codigoOrganismo_tipo_numero_anio_key" ON "Expediente"("codigoOrganismo", "tipo", "numero", "anio");
CREATE UNIQUE INDEX "TipoVinculo_descripcion_key" ON "TipoVinculo"("descripcion");
CREATE UNIQUE INDEX "ExpedientePersona_expedienteId_personaId_tipoVinculoId_key" ON "ExpedientePersona"("expedienteId", "personaId", "tipoVinculoId");
CREATE INDEX "ExpedientePersona_expedienteId_esActorPrincipal_idx" ON "ExpedientePersona"("expedienteId", "esActorPrincipal");
CREATE UNIQUE INDEX "ExpedientePersona_un_actor_principal" ON "ExpedientePersona"("expedienteId") WHERE "esActorPrincipal" = true;
CREATE UNIQUE INDEX "ExpedientePersona_expedienteId_personaId_key" ON "ExpedientePersona"("expedienteId", "personaId");

ALTER TABLE "Expediente" ADD CONSTRAINT "Expediente_codigoOrganismo_fkey" FOREIGN KEY ("codigoOrganismo") REFERENCES "Organismo"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ExpedientePersona" ADD CONSTRAINT "ExpedientePersona_expedienteId_fkey" FOREIGN KEY ("expedienteId") REFERENCES "Expediente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExpedientePersona" ADD CONSTRAINT "ExpedientePersona_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ExpedientePersona" ADD CONSTRAINT "ExpedientePersona_tipoVinculoId_fkey" FOREIGN KEY ("tipoVinculoId") REFERENCES "TipoVinculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

DROP INDEX IF EXISTS "ExpedientePersona_expedienteId_personaId_tipoVinculoId_key";

