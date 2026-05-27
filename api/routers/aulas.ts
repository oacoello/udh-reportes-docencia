import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { aulas } from "@db/schema";
import { eq } from "drizzle-orm";

export const aulasRouter = createRouter({
  list: publicQuery.query(async () => getDb().select().from(aulas)),
  create: publicQuery.input(z.object({ nombre: z.string().min(1), ubicacion: z.string().optional(), capacidad: z.number().optional(), recursos: z.array(z.string()).optional() })).mutation(async ({ input }) => {
    const result = await getDb().insert(aulas).values(input).returning();
    return result[0];
  }),
  update: publicQuery.input(z.object({ id: z.number(), nombre: z.string().optional(), ubicacion: z.string().optional(), capacidad: z.number().optional(), recursos: z.array(z.string()).optional(), activo: z.boolean().optional() })).mutation(async ({ input }) => {
    const { id, ...data } = input;
    const result = await getDb().update(aulas).set(data).where(eq(aulas.id, id)).returning();
    return result[0];
  }),
  delete: publicQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await getDb().delete(aulas).where(eq(aulas.id, input.id));
    return { success: true };
  }),
});
