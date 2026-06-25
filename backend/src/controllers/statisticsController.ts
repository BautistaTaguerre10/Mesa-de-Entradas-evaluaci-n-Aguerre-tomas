// Controlador de estadisticas. Devuelve los datos del dashboard.
import type { Request, Response } from "express";
import { StatisticsService } from "../services/statisticsService";

export class StatisticsController {
  constructor(private readonly service = new StatisticsService()) {}

  dashboard = async (_request: Request, response: Response) => {
    const data = await this.service.getDashboard();
    response.json({ data });
  };
}
