import { relations } from "drizzle-orm";
import {
  users,
  localUsers,
  docentes,
  programas,
  aulas,
  clases,
  criteriosCoordinador,
  criteriosSupervision,
  evaluacionesCoordinador,
  evaluacionesSupervision,
  reportesGenerados,
} from "./schema";

export const usersRelations = relations(users, () => ({}));

export const localUsersRelations = relations(localUsers, () => ({}));

export const docentesRelations = relations(docentes, ({ many }) => ({
  evaluacionesCoordinador: many(evaluacionesCoordinador),
  evaluacionesSupervision: many(evaluacionesSupervision),
}));

export const programasRelations = relations(programas, ({ many }) => ({
  clases: many(clases),
}));

export const aulasRelations = relations(aulas, ({ many }) => ({
  clases: many(clases),
}));

export const clasesRelations = relations(clases, ({ one }) => ({
  programa: one(programas, { fields: [clases.programaId], references: [programas.id] }),
  docente: one(docentes, { fields: [clases.docenteId], references: [docentes.id] }),
  aula: one(aulas, { fields: [clases.aulaId], references: [aulas.id] }),
}));

export const evaluacionesCoordinadorRelations = relations(evaluacionesCoordinador, ({ one }) => ({
  docente: one(docentes, { fields: [evaluacionesCoordinador.docenteId], references: [docentes.id] }),
}));

export const evaluacionesSupervisionRelations = relations(evaluacionesSupervision, ({ one }) => ({
  docente: one(docentes, { fields: [evaluacionesSupervision.docenteId], references: [docentes.id] }),
}));
