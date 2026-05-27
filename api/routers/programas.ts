import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { programas } from "@db/schema";
import { eq } from "drizzle-orm";

export const programasRouter = createRouter({
  list: publicQuery.query(async () => getDb().select().from(programas)),
  create: publicQuery.input(z.object({ nombre: z.string().min(1), descripcion: z.string().optional(), duracion: z.string().optional() })).mutation(async ({ input }) => {
    const result = await getDb().insert(programas).values(input).returning();
    return result[0];
  }),
  update: publicQuery.input(z.object({ id: z.number(), nombre: z.string().optional(), descripcion: z.string().optional(), duracion: z.string().optional(), activo: z.boolean().optional() })).mutation(async ({ input }) => {
    const { id, ...data } = input;
    const result = await getDb().update(programas).set(data).where(eq(programas.id, id)).returning();
    return result[0];
  }),
  delete: publicQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await getDb().delete(programas).where(eq(programas.id, input.id));
    return { success: true };
  }),
});
