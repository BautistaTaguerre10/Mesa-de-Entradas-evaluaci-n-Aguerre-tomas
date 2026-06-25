// Cliente HTTP base del frontend. Centraliza llamadas a la API y manejo de errores.
const API_URL = import.meta.env.VITE_API_URL ?? "/api";

interface ApiErrorBody {
  message?: string;
  details?: unknown;
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let body: ApiErrorBody = {};
    try {
      body = (await response.json()) as ApiErrorBody;
    } catch {
      body = {};
    }

    throw new Error(body.message ?? "No se pudo completar la operacion");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
