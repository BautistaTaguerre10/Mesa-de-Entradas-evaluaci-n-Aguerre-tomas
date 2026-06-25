// Punto de arranque del backend. Levanta Express en el puerto configurado.
import { app } from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => {
  console.log(`API disponible en http://localhost:${env.PORT}/api`);
});
