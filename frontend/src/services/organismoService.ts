// Servicio de organismos. Encapsula las llamadas HTTP relacionadas con Organismo.
import { apiRequest } from "./api";
import type { ApiItemResponse, ApiListResponse } from "../types/api";
import type { Organismo } from "../types/domain";

export type OrganismoPayload = Omit<Organismo, "id">;

export const organismoService = {
  list: () => apiRequest<ApiListResponse<Organismo>>("/organismos").then((response) => response.data),
  create: (payload: OrganismoPayload) =>
    apiRequest<ApiItemResponse<Organismo>>("/organismos", {
      method: "POST",
      body: JSON.stringify(payload),
    }).then((response) => response.data),
  update: (id: number, payload: OrganismoPayload) =>
    apiRequest<ApiItemResponse<Organismo>>(`/organismos/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }).then((response) => response.data),
  delete: (id: number) => apiRequest<void>(`/organismos/${id}`, { method: "DELETE" }),
};
