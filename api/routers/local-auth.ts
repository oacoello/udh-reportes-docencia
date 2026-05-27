import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { localUsers } from "@db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.APP_SECRET || "udh-secret-key";

export const localAuthRouter = createRouter({
  register: publicQuery
    .input(z.object({
      usuario: z.string().min(3).max(100),
      serie: z.string().min(3).max(50),
      email: z.string().email(),
      password: z.string().min(6),
      nombre: z.string().min(1),
      apellido: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db.select().from(localUsers).where(eq(localUsers.usuario, input.usuario)).limit(1);
      if (existing.length > 0) throw new TRPCError({ code: "CONFLICT", message: "Usuario ya existe" });
      const hash = await bcrypt.hash(input.password, 10);
      const result = await db.insert(localUsers).values({ ...input, password: hash, role: "user", activo: true }).returning();
      const user = result[0];
      const token = jwt.sign({ id: user.id, usuario: user.usuario, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
      return { token, user: { id: user.id, usuario: user.usuario, nombre: user.nombre, apellido: user.apellido, role: user.role, email: user.email, serie: user.serie } };
    }),

  login: publicQuery
    .input(z.object({
      usuario: z.string(),
      serie: z.string(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const results = await db.select().from(localUsers).where(eq(localUsers.usuario, input.usuario)).limit(1);
      if (results.length === 0) throw new TRPCError({ code: "UNAUTHORIZED", message: "Credenciales invalidas" });
      const user = results[0];
      if (user.serie !== input.serie) throw new TRPCError({ code: "UNAUTHORIZED", message: "Numero de serie incorrecto" });
      if (!user.activo) throw new TRPCError({ code: "FORBIDDEN", message: "Usuario inactivo" });
      const valid = await bcrypt.compare(input.password, user.password);
      if (!valid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Contrasena incorrecta" });
      await db.update(localUsers).set({ lastSignInAt: new Date() }).where(eq(localUsers.id, user.id));
      const token = jwt.sign({ id: user.id, usuario: user.usuario, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
      return { token, user: { id: user.id, usuario: user.usuario, nombre: user.nombre, apellido: user.apellido, role: user.role, email: user.email, serie: user.serie } };
    }),

  me: publicQuery
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      try {
        const decoded = jwt.verify(input.token, JWT_SECRET) as { id: number };
        const db = getDb();
        const results = await db.select().from(localUsers).where(eq(localUsers.id, decoded.id)).limit(1);
        if (results.length === 0) return null;
        const user = results[0];
        return { id: user.id, usuario: user.usuario, nombre: user.nombre, apellido: user.apellido, role: user.role, email: user.email, serie: user.serie };
      } catch {
        return null;
      }
    }),
});
