// Rutas HTTP para el ABM de expedientes.
import { Router } from "express";
import { ExpedienteController } from "../controllers/expedienteController";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
const controller = new ExpedienteController();

router.get("/", asyncHandler(controller.list));
router.get("/:id", asyncHandler(controller.get));
router.post("/", asyncHandler(controller.create));
router.put("/:id", asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.delete));

export { router as expedienteRoutes };
