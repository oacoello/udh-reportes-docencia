import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { reportesGenerados, evaluacionesCoordinador, evaluacionesSupervision, docentes } from "@db/schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";

export const reportesRouter = createRouter({
  list: publicQuery.query(async () => {
    return getDb().select().from(reportesGenerados).orderBy(desc(reportesGenerados.createdAt));
  }),

  create: publicQuery.input(z.object({
    tipo: z.enum(["semanal", "mensual"]),
    periodoInicio: z.string(),
    periodoFin: z.string(),
    titulo: z.string(),
    contenidoResumen: z.string(),
  })).mutation(async ({ input }) => {
    const result = await getDb().insert(reportesGenerados).values(input).returning();
    return result[0];
  }),

  dataReporte: publicQuery.input(z.object({
    tipo: z.enum(["semanal", "mensual"]),
    fechaInicio: z.string(),
    fechaFin: z.string(),
  })).query(async ({ input }) => {
    const db = getDb();
    const allDocentes = await db.select().from(docentes);

    const evalCoord = await db.select().from(evaluacionesCoordinador)
      .where(and(
        gte(evaluacionesCoordinador.fecha, input.fechaInicio),
        lte(evaluacionesCoordinador.fecha, input.fechaFin)
      ));

    const evalSup = await db.select().from(evaluacionesSupervision)
      .where(and(
        gte(evaluacionesSupervision.fecha, input.fechaInicio),
        lte(evaluacionesSupervision.fecha, input.fechaFin)
      ));

    const promediosPorDocente: Record<string, { nombre: string; suma: number; count: number }> = {};
    for (const e of evalCoord) {
      const d = allDocentes.find(doc => doc.id === e.docenteId);
      if (!d) continue;
      const key = `${d.nombre} ${d.apellido}`;
      if (!promediosPorDocente[key]) promediosPorDocente[key] = { nombre: key, suma: 0, count: 0 };
      promediosPorDocente[key].suma += e.calificacionTotal || 0;
      promediosPorDocente[key].count++;
    }

    const ranking = Object.values(promediosPorDocente)
      .map(d => ({ nombre: d.nombre, promedio: d.suma / d.count }))
      .sort((a, b) => b.promedio - a.promedio);

    return {
      totalCoordinador: evalCoord.length,
      totalSupervision: evalSup.length,
      rankingDocentes: ranking,
      evaluacionesCoordinador: evalCoord,
      evaluacionesSupervision: evalSup,
      periodo: { inicio: input.fechaInicio, fin: input.fechaFin },
    };
  }),
});
