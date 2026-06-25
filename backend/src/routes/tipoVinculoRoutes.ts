// Ruta HTTP para consultar los tipos de vinculo disponibles.
import { Router } from "express";
import { TipoVinculoController } from "../controllers/tipoVinculoController";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
const controller = new TipoVinculoController();

router.get("/", asyncHandler(controller.list));

export { router as tipoVinculoRoutes };
