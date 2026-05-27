import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { criteriosCoordinador, criteriosSupervision } from "@db/schema";

export const criteriosRouter = createRouter({
  coordinador: publicQuery.query(async () => {
    const results = await getDb().select().from(criteriosCoordinador);
    const grouped: Record<string, typeof results> = {};
    for (const c of results) {
      if (!grouped[c.seccion]) grouped[c.seccion] = [];
      grouped[c.seccion].push(c);
    }
    return grouped;
  }),
  supervision: publicQuery.query(async () => {
    const results = await getDb().select().from(criteriosSupervision);
    const grouped: Record<string, typeof results> = {};
    for (const c of results) {
      if (!grouped[c.seccion]) grouped[c.seccion] = [];
      grouped[c.seccion].push(c);
    }
    return grouped;
  }),
});
