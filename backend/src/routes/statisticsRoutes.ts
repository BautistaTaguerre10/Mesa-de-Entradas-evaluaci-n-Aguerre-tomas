// Ruta HTTP para consultar estadisticas del dashboard.
import { Router } from "express";
import { StatisticsController } from "../controllers/statisticsController";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
const controller = new StatisticsController();

router.get("/dashboard", asyncHandler(controller.dashboard));

export { router as statisticsRoutes };
