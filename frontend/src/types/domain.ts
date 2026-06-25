// Tipos del dominio compartidos por paginas, servicios y componentes.
export type Ciudad = "NEUQUEN" | "ZAPALA" | "JUNIN_DE_LOS_ANDES";
export type Fuero = "EJECUTIVOS" | "CIVIL" | "LABORAL" | "FAMILIA";
export type TipoExpediente = "EXP" | "LEG";

export interface Persona {
  id: number;
  dni: string;
  apellido: string;
  nombre: string;
}

export interface Organismo {
  id: number;
  codigo: string;
  nombre: string;
  caratulaTitulo: string;
  ciudad: Ciudad;
  fuero: Fuero;
}

export interface TipoVinculo {
  id: number;
  descripcion: string;
}

export interface ExpedientePersona {
  id: number;
  expedienteId: number;
  personaId: number;
  tipoVinculoId: number;
  esActorPrincipal: boolean;
  persona: Persona;
  tipoVinculo: TipoVinculo;
}

export interface Expediente {
  id: number;
  codigoOrganismo: string;
  tipo: TipoExpediente;
  numero: number;
  anio: number;
  caratula: string;
  ciudad: Ciudad;
  clave: string;
  organismo: Organismo;
  personas: ExpedientePersona[];
}

export interface DashboardStats {
  totales: {
    personas: number;
    organismos: number;
    expedientes: number;
  };
  expedientesPorTipo: Array<{ tipo: TipoExpediente; total: number }>;
  expedientesPorAnio: Array<{ anio: number; total: number }>;
  expedientesPorCiudad: Array<{ ciudad: Ciudad; total: number }>;
  expedientesPorFuero: Array<{ fuero: Fuero; total: number }>;
  expedientesEnTramitePorCiudadYFuero: Array<{
    ciudad: Ciudad;
    ejecutivos: number;
    civil: number;
    laboral: number;
    familia: number;
    total: number;
  }>;
}
