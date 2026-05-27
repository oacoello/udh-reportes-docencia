import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { evaluacionesSupervision, docentes } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const evalSupervisionRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    const evals = await db.select().from(evaluacionesSupervision).orderBy(desc(evaluacionesSupervision.createdAt));
    const allDocentes = await db.select().from(docentes);
    return evals.map(e => ({ ...e, docente: allDocentes.find(d => d.id === e.docenteId) }));
  }),

  create: publicQuery.input(z.object({
    docenteId: z.number(),
    aula: z.string().optional(),
    programaAcademico: z.string().optional(),
    clase: z.string().optional(),
    fecha: z.string(),
    periodo: z.string(),
    calificacionesDocente: z.record(z.number()).optional(),
    calificacionesEstudiantes: z.record(z.number()).optional(),
    calificacionesEspacio: z.record(z.number()).optional(),
    notaDocente: z.number().optional(),
    notaEstudiantes: z.number().optional(),
    notaEspacioFisico: z.number().optional(),
    comentarioGeneral: z.string().optional(),
  })).mutation(async ({ input }) => {
    const result = await getDb().insert(evaluacionesSupervision).values(input).returning();
    return result[0];
  }),

  delete: publicQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await getDb().delete(evaluacionesSupervision).where(eq(evaluacionesSupervision.id, input.id));
    return { success: true };
  }),

  stats: publicQuery.query(async () => {
    const db = getDb();
    const allEvals = await db.select().from(evaluacionesSupervision);
    if (allEvals.length === 0) return { count: 0, promedios: {} };
    const nd = allEvals.filter(e => e.notaDocente).map(e => e.notaDocente!);
    const ne = allEvals.filter(e => e.notaEstudiantes).map(e => e.notaEstudiantes!);
    const nes = allEvals.filter(e => e.notaEspacioFisico).map(e => e.notaEspacioFisico!);
    return {
      count: allEvals.length,
      promedios: {
        "Criterios del Docente": nd.length > 0 ? nd.reduce((a, b) => a + b, 0) / nd.length : 0,
        "Criterios de los Estudiantes": ne.length > 0 ? ne.reduce((a, b) => a + b, 0) / ne.length : 0,
        "Criterios del Espacio Fisico": nes.length > 0 ? nes.reduce((a, b) => a + b, 0) / nes.length : 0,
      },
    };
  }),
});
