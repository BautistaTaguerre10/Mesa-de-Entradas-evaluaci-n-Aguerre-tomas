// Tipos genericos de respuesta usados por la API.
export interface ApiListResponse<T> {
  data: T[];
}

export interface ApiItemResponse<T> {
  data: T;
}
