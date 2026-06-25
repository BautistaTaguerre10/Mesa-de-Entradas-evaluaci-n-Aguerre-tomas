// Configura la app Express: middlewares, rutas API y frontend en produccion.
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { env } from "./config/env";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware";
import { apiRoutes } from "./routes";

export const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN }));
app.use(express.json());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.use("/api", apiRoutes);
app.use("/api", notFoundMiddleware);

if (env.NODE_ENV === "production") {
  const frontendDist = path.resolve(__dirname, "../../frontend/dist");
  app.use(express.static(frontendDist));
  app.get("*", (_request, response) => {
    response.sendFile(path.join(frontendDist, "index.html"));
  });
} else {
  app.use(notFoundMiddleware);
}

app.use(errorMiddleware);
