import { authRouter } from "./auth-router";
import { localAuthRouter } from "./routers/local-auth";
import { docentesRouter } from "./routers/docentes";
import { programasRouter } from "./routers/programas";
import { aulasRouter } from "./routers/aulas";
import { clasesRouter } from "./routers/clases";
import { criteriosRouter } from "./routers/criterios";
import { evalCoordinadorRouter } from "./routers/eval-coordinador";
import { evalSupervisionRouter } from "./routers/eval-supervision";
import { reportesRouter } from "./routers/reportes";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  localAuth: localAuthRouter,
  docentes: docentesRouter,
  programas: programasRouter,
  aulas: aulasRouter,
  clases: clasesRouter,
  criterios: criteriosRouter,
  evalCoordinador: evalCoordinadorRouter,
  evalSupervision: evalSupervisionRouter,
  reportes: reportesRouter,
});

export type AppRouter = typeof appRouter;
