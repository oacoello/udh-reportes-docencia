import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { docentes } from "@db/schema";
import { eq } from "drizzle-orm";

export const docentesRouter = createRouter({
  list: publicQuery.query(async () => {
    return getDb().select().from(docentes);
  }),

  getById: publicQuery.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const results = await getDb().select().from(docentes).where(eq(docentes.id, input.id)).limit(1);
    return results[0] || null;
  }),

  create: publicQuery
    .input(z.object({
      nombre: z.string().min(1),
      apellido: z.string().min(1),
      email: z.string().optional(),
      telefono: z.string().optional(),
      especialidad: z.string().optional(),
      gradoAcademico: z.enum(["Licenciatura", "Maestria", "Doctorado", "Postdoctorado"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await getDb().insert(docentes).values(input).returning();
      return result[0];
    }),

  update: publicQuery
    .input(z.object({
      id: z.number(),
      nombre: z.string().optional(),
      apellido: z.string().optional(),
      email: z.string().optional(),
      telefono: z.string().optional(),
      especialidad: z.string().optional(),
      gradoAcademico: z.enum(["Licenciatura", "Maestria", "Doctorado", "Postdoctorado"]).optional(),
      activo: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const result = await getDb().update(docentes).set(data).where(eq(docentes.id, id)).returning();
      return result[0];
    }),

  delete: publicQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await getDb().delete(docentes).where(eq(docentes.id, input.id));
    return { success: true };
  }),
});
