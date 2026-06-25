// Agrupa todas las rutas de la API bajo el prefijo /api.
import { Router } from "express";
import { expedienteRoutes } from "./expedienteRoutes";
import { organismoRoutes } from "./organismoRoutes";
import { personaRoutes } from "./personaRoutes";
import { statisticsRoutes } from "./statisticsRoutes";
import { tipoVinculoRoutes } from "./tipoVinculoRoutes";

const router = Router();

router.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

router.use("/personas", personaRoutes);
router.use("/organismos", organismoRoutes);
router.use("/expedientes", expedienteRoutes);
router.use("/tipos-vinculo", tipoVinculoRoutes);
router.use("/estadisticas", statisticsRoutes);

export { router as apiRoutes };
