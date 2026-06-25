// Tipos genericos de respuesta usados por los servicios HTTP.
export interface ApiItemResponse<T> {
  data: T;
}

export interface ApiListResponse<T> {
  data: T[];
}
