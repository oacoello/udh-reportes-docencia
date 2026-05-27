import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { evaluacionesCoordinador, docentes } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const evalCoordinadorRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    const evals = await db.select().from(evaluacionesCoordinador).orderBy(desc(evaluacionesCoordinador.createdAt));
    const allDocentes = await db.select().from(docentes);
    return evals.map(e => ({ ...e, docente: allDocentes.find(d => d.id === e.docenteId) }));
  }),

  byDocente: publicQuery.input(z.object({ docenteId: z.number() })).query(async ({ input }) => {
    return getDb().select().from(evaluacionesCoordinador).where(eq(evaluacionesCoordinador.docenteId, input.docenteId)).orderBy(desc(evaluacionesCoordinador.createdAt));
  }),

  create: publicQuery.input(z.object({
    docenteId: z.number(),
    fecha: z.string(),
    periodo: z.string(),
    calificaciones: z.record(z.number()),
    notaCarpeta: z.number().optional(),
    notaDesempeno: z.number().optional(),
    notaPerfil: z.number().optional(),
    calificacionTotal: z.number().optional(),
    comentarios: z.string().optional(),
  })).mutation(async ({ input }) => {
    const result = await getDb().insert(evaluacionesCoordinador).values(input).returning();
    return result[0];
  }),

  delete: publicQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await getDb().delete(evaluacionesCoordinador).where(eq(evaluacionesCoordinador.id, input.id));
    return { success: true };
  }),

  stats: publicQuery.query(async () => {
    const db = getDb();
    const allEvals = await db.select().from(evaluacionesCoordinador);
    if (allEvals.length === 0) return { count: 0, promedio: 0, porSeccion: {} };
    const promedio = allEvals.reduce((s, e) => s + (e.calificacionTotal || 0), 0) / allEvals.length;
    const notasCarpeta = allEvals.filter(e => e.notaCarpeta).map(e => e.notaCarpeta!);
    const notasDesempeno = allEvals.filter(e => e.notaDesempeno).map(e => e.notaDesempeno!);
    const notasPerfil = allEvals.filter(e => e.notaPerfil).map(e => e.notaPerfil!);
    return {
      count: allEvals.length,
      promedio,
      porSeccion: {
        "Carpeta Docente": notasCarpeta.length > 0 ? notasCarpeta.reduce((a, b) => a + b, 0) / notasCarpeta.length : 0,
        "Desempeno Docente": notasDesempeno.length > 0 ? notasDesempeno.reduce((a, b) => a + b, 0) / notasDesempeno.length : 0,
        "Perfil Docente": notasPerfil.length > 0 ? notasPerfil.reduce((a, b) => a + b, 0) / notasPerfil.length : 0,
      },
    };
  }),
});
