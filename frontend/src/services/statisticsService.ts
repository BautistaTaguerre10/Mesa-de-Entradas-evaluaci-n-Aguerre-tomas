// Servicio de estadisticas. Consulta los datos del dashboard.
import { apiRequest } from "./api";
import type { ApiItemResponse } from "../types/api";
import type { DashboardStats } from "../types/domain";

export const statisticsService = {
  dashboard: () =>
    apiRequest<ApiItemResponse<DashboardStats>>("/estadisticas/dashboard").then((response) => response.data),
};
