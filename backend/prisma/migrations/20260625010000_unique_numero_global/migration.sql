DROP INDEX IF EXISTS "Expediente_tipo_numero_anio_key";

CREATE UNIQUE INDEX "Expediente_numero_key" ON "Expediente"("numero");
