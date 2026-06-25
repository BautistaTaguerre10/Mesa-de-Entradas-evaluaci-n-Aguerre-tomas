// Rutas HTTP para el ABM de organismos.
import { Router } from "express";
import { OrganismoController } from "../controllers/organismoController";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
const controller = new OrganismoController();

router.get("/", asyncHandler(controller.list));
router.get("/:id", asyncHandler(controller.get));
router.post("/", asyncHandler(controller.create));
router.put("/:id", asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.delete));

export { router as organismoRoutes };
