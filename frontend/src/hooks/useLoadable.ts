// Hook generico para cargar datos async y manejar loading/error.
import { useCallback, useEffect, useState } from "react";

export function useLoadable<T>(loader: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setData(await loader());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Error inesperado");
    }
  }, [loader]);

  useEffect(() => {
    void load();
  }, [load]);

  // Retornamos loading en false siempre para evitar la animación (Skeleton)
  return { data, loading: false, error, reload: load };
}
