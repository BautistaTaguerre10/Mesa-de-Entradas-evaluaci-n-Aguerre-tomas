// Servicio de tipos de vinculo. Obtiene el catalogo ACTOR/DEMANDADO/etc.
import { apiRequest } from "./api";
import type { ApiListResponse } from "../types/api";
import type { TipoVinculo } from "../types/domain";

export const tipoVinculoService = {
  list: () => apiRequest<ApiListResponse<TipoVinculo>>("/tipos-vinculo").then((response) => response.data),
};
