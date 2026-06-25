// Catalogos y funciones para generar codigos de organismo y claves de expediente.
import type { Ciudad, Fuero } from "@prisma/client";

export const ciudadLabels: Record<Ciudad, string> = {
  NEUQUEN: "Neuquén",
  ZAPALA: "Zapala",
  JUNIN_DE_LOS_ANDES: "Junín de los Andes",
};

export const fueroLabels: Record<Fuero, string> = {
  EJECUTIVOS: "Ejecutivos",
  CIVIL: "Civil",
  LABORAL: "Laboral",
  FAMILIA: "Familia",
};

export const ciudadCodigos: Record<Ciudad, string> = {
  NEUQUEN: "NQ",
  ZAPALA: "ZA",
  JUNIN_DE_LOS_ANDES: "JU",
};

export const fueroCodigos: Record<Fuero, string> = {
  EJECUTIVOS: "EJ",
  CIVIL: "CI",
  LABORAL: "LA",
  FAMILIA: "FA",
};

export function buildOrganismoCodigo(ciudad: Ciudad, fuero: Fuero) {
  return `J${ciudadCodigos[ciudad]}${fueroCodigos[fuero]}`;
}

export function buildExpedienteClave(codigoOrganismo: string, tipo: string, numero: number, anio: number) {
  return `${codigoOrganismo} ${tipo} ${numero}/${anio}`;
}
