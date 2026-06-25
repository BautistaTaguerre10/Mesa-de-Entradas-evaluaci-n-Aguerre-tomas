// Controlador de organismos. Maneja listado, alta, edicion y baja.
import type { Request, Response } from "express";
import { OrganismoService } from "../services/organismoService";
import { idParamSchema, paginationQuerySchema } from "../types/validators";

export class OrganismoController {
  constructor(private readonly service = new OrganismoService()) {}

  list = async (request: Request, response: Response) => {
    const { search } = paginationQuerySchema.parse(request.query);
    const data = await this.service.list(search);
    response.json({ data });
  };

  get = async (request: Request, response: Response) => {
    const { id } = idParamSchema.parse(request.params);
    const data = await this.service.get(id);
    response.json({ data });
  };

  create = async (request: Request, response: Response) => {
    const data = await this.service.create(request.body);
    response.status(201).json({ data });
  };

  update = async (request: Request, response: Response) => {
    const { id } = idParamSchema.parse(request.params);
    const data = await this.service.update(id, request.body);
    response.json({ data });
  };

  delete = async (request: Request, response: Response) => {
    const { id } = idParamSchema.parse(request.params);
    await this.service.delete(id);
    response.status(204).send();
  };
}
