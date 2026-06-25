// Servicio de estadisticas. Agrupa expedientes para el dashboard.
import { prisma } from "../prisma/client";

export class StatisticsService {
  async getDashboard() {
    const [
      personas,
      organismos,
      expedientes,
      expedientesPorTipo,
      expedientesPorAnio,
      expedientesPorCiudad,
      expedientesConOrganismo,
      expedientesParaMatriz,
    ] =
      await Promise.all([
        prisma.persona.count(),
        prisma.organismo.count(),
        prisma.expediente.count(),
        prisma.expediente.groupBy({ by: ["tipo"], _count: { _all: true } }),
        prisma.expediente.groupBy({ by: ["anio"], _count: { _all: true }, orderBy: { anio: "desc" } }),
        prisma.expediente.groupBy({ by: ["ciudad"], _count: { _all: true } }),
        prisma.expediente.findMany({ select: { organismo: { select: { fuero: true } } } }),
        prisma.expediente.findMany({ select: { ciudad: true, organismo: { select: { fuero: true } } } }),
      ]);

    const expedientesPorFuero = expedientesConOrganismo.reduce<Record<string, number>>((accumulator, expediente) => {
      const fuero = expediente.organismo.fuero;
      accumulator[fuero] = (accumulator[fuero] ?? 0) + 1;
      return accumulator;
    }, {});

    const expedientesEnTramitePorCiudadYFuero = expedientesParaMatriz.reduce<Record<string, Record<string, number>>>(
      (accumulator, expediente) => {
        const ciudad = expediente.ciudad;
        const fuero = expediente.organismo.fuero;
        accumulator[ciudad] = accumulator[ciudad] ?? {};
        accumulator[ciudad][fuero] = (accumulator[ciudad][fuero] ?? 0) + 1;
        return accumulator;
      },
      {},
    );

    return {
      totales: {
        personas,
        organismos,
        expedientes,
      },
      expedientesPorTipo: expedientesPorTipo.map((item) => ({
        tipo: item.tipo,
        total: item._count._all,
      })),
      expedientesPorAnio: expedientesPorAnio.map((item) => ({
        anio: item.anio,
        total: item._count._all,
      })),
      expedientesPorCiudad: expedientesPorCiudad.map((item) => ({
        ciudad: item.ciudad,
        total: item._count._all,
      })),
      expedientesPorFuero: Object.entries(expedientesPorFuero).map(([fuero, total]) => ({ fuero, total })),
      expedientesEnTramitePorCiudadYFuero: Object.entries(expedientesEnTramitePorCiudadYFuero).map(
        ([ciudad, fueros]) => ({
          ciudad,
          ejecutivos: fueros.EJECUTIVOS ?? 0,
          civil: fueros.CIVIL ?? 0,
          laboral: fueros.LABORAL ?? 0,
          familia: fueros.FAMILIA ?? 0,
          total: Object.values(fueros).reduce((sum, value) => sum + value, 0),
        }),
      ),
    };
  }
}
