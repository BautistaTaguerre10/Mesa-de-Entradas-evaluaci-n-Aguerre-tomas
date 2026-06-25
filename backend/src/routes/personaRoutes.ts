// Rutas HTTP para personas y sus expedientes asociados.
import { Router } from "express";
import { PersonaController } from "../controllers/personaController";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
const controller = new PersonaController();

router.get("/", asyncHandler(controller.list));
router.get("/:id/expedientes", asyncHandler(controller.expedientes));
router.get("/:id", asyncHandler(controller.get));
router.post("/", asyncHandler(controller.create));
router.put("/:id", asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.delete));

export { router as personaRoutes };
