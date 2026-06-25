// Controlador de tipos de vinculo. Devuelve el catalogo inicial.
import type { Request, Response } from "express";
import { TipoVinculoService } from "../services/tipoVinculoService";

export class TipoVinculoController {
  constructor(private readonly service = new TipoVinculoService()) {}

  list = async (_request: Request, response: Response) => {
    const data = await this.service.list();
    response.json({ data });
  };
}
