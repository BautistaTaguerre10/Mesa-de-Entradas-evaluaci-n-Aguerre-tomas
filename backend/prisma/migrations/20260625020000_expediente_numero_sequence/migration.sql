CREATE SEQUENCE IF NOT EXISTS "Expediente_numero_seq";

SELECT setval(
  '"Expediente_numero_seq"',
  GREATEST(COALESCE((SELECT MAX("numero") FROM "Expediente"), 0), 1),
  COALESCE((SELECT MAX("numero") FROM "Expediente"), 0) > 0
);
