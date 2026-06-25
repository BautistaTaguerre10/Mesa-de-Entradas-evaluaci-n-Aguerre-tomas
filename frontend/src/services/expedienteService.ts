// Servicio de expedientes. Define payloads y llamadas HTTP para Expediente.
import { apiRequest } from "./api";
import type { ApiItemResponse, ApiListResponse } from "../types/api";
import type { Ciudad, Expediente, TipoExpediente } from "../types/domain";

export interface ExpedientePersonaPayload {
  personaId: number;
  tipoVinculoId: number;
  esActorPrincipal: boolean;
}

export interface ExpedientePayload {
  codigoOrganismo: string;
  tipo: TipoExpediente;
  numero?: number;
  anio: number;
  caratula: string;
  ciudad: Ciudad;
  personas: ExpedientePersonaPayload[];
}

export const expedienteService = {
  list: () => apiRequest<ApiListResponse<Expediente>>("/expedientes").then((response) => response.data),
  create: (payload: ExpedientePayload) =>
    apiRequest<ApiItemResponse<Expediente>>("/expedientes", {
      method: "POST",
      body: JSON.stringify(payload),
    }).then((response) => response.data),
  update: (id: number, payload: ExpedientePayload) =>
    apiRequest<ApiItemResponse<Expediente>>(`/expedientes/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }).then((response) => response.data),
  delete: (id: number) => apiRequest<void>(`/expedientes/${id}`, { method: "DELETE" }),
};
