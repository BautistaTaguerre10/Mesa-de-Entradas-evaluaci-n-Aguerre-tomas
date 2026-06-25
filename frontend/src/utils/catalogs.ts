// Catalogos y helpers de etiquetas/codigos usados en formularios y tablas.
import type { Ciudad, Fuero, TipoExpediente } from "../types/domain";

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

export const tipoExpedienteLabels: Record<TipoExpediente, string> = {
  EXP: "Expediente",
  LEG: "Legajo",
};

const ciudadCodigos: Record<Ciudad, string> = {
  NEUQUEN: "NQ",
  ZAPALA: "ZA",
  JUNIN_DE_LOS_ANDES: "JU",
};

const fueroCodigos: Record<Fuero, string> = {
  EJECUTIVOS: "EJ",
  CIVIL: "CI",
  LABORAL: "LA",
  FAMILIA: "FA",
};

export function buildOrganismoCodigo(ciudad?: Ciudad, fuero?: Fuero) {
  if (!ciudad || !fuero) {
    return "";
  }

  return `J${ciudadCodigos[ciudad]}${fueroCodigos[fuero]}`;
}
