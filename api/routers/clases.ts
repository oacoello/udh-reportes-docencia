import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { clases, docentes, programas, aulas } from "@db/schema";
import { eq } from "drizzle-orm";

export const clasesRouter = createRouter({
  list: publicQuery.query(async () => {
    const results = await getDb().select().from(clases);
    return results;
  }),
  listWithDetails: publicQuery.query(async () => {
    const db = getDb();
    const allClases = await db.select().from(clases);
    const allDocentes = await db.select().from(docentes);
    const allProgramas = await db.select().from(programas);
    const allAulas = await db.select().from(aulas);
    return allClases.map(c => ({
      ...c,
      docente: allDocentes.find(d => d.id === c.docenteId),
      programa: allProgramas.find(p => p.id === c.programaId),
      aula: allAulas.find(a => a.id === c.aulaId),
    }));
  }),
  create: publicQuery.input(z.object({
    nombre: z.string().min(1),
    programaId: z.number().optional(),
    docenteId: z.number().optional(),
    aulaId: z.number().optional(),
    horario: z.string().optional(),
    diaSemana: z.enum(["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"]).optional(),
  })).mutation(async ({ input }) => {
    const result = await getDb().insert(clases).values(input).returning();
    return result[0];
  }),
  update: publicQuery.input(z.object({
    id: z.number(),
    nombre: z.string().optional(),
    programaId: z.number().optional(),
    docenteId: z.number().optional(),
    aulaId: z.number().optional(),
    horario: z.string().optional(),
    diaSemana: z.enum(["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"]).optional(),
    activo: z.boolean().optional(),
  })).mutation(async ({ input }) => {
    const { id, ...data } = input;
    const result = await getDb().update(clases).set(data).where(eq(clases.id, id)).returning();
    return result[0];
  }),
  delete: publicQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await getDb().delete(clases).where(eq(clases.id, input.id));
    return { success: true };
  }),
});
