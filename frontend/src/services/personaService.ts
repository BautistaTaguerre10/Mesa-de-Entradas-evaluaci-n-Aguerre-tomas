// Servicio de personas. Encapsula las llamadas HTTP relacionadas con Persona.
import { apiRequest } from "./api";
import type { ApiItemResponse, ApiListResponse } from "../types/api";
import type { Expediente, Persona } from "../types/domain";

export type PersonaPayload = Omit<Persona, "id">;

export const personaService = {
  list: () => apiRequest<ApiListResponse<Persona>>("/personas").then((response) => response.data),
  listExpedientes: (id: number) =>
    apiRequest<ApiListResponse<Expediente>>(`/personas/${id}/expedientes`).then((response) => response.data),
  create: (payload: PersonaPayload) =>
    apiRequest<ApiItemResponse<Persona>>("/personas", {
      method: "POST",
      body: JSON.stringify(payload),
    }).then((response) => response.data),
  update: (id: number, payload: PersonaPayload) =>
    apiRequest<ApiItemResponse<Persona>>(`/personas/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }).then((response) => response.data),
  delete: (id: number) => apiRequest<void>(`/personas/${id}`, { method: "DELETE" }),
};
