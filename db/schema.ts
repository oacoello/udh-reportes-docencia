import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  int,
  float,
  json,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

// ============================================================
// ENUMS (mysqlEnum for MySQL)
// ============================================================
export const roleEnum = mysqlEnum("role", ["user", "admin"]);
export const gradoEnum = mysqlEnum("grado_academico", ["Licenciatura", "Maestria", "Doctorado", "Postdoctorado"]);
export const diaSemanaEnum = mysqlEnum("dia_semana", ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"]);

// ============================================================
// USERS (OAuth - Kimi Auth)
// ============================================================
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: roleEnum.default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

// ============================================================
// LOCAL USERS (Login propio: usuario, serie, correo)
// ============================================================
export const localUsers = mysqlTable("local_users", {
  id: serial("id").primaryKey(),
  usuario: varchar("usuario", { length: 100 }).notNull().unique(),
  serie: varchar("serie", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 320 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  apellido: varchar("apellido", { length: 255 }).notNull(),
  role: roleEnum.default("user").notNull(),
  activo: int("activo", { unsigned: true }).default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt"),
});

// ============================================================
// DOCENTES
// ============================================================
export const docentes = mysqlTable("docentes", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  apellido: varchar("apellido", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  telefono: varchar("telefono", { length: 50 }),
  especialidad: varchar("especialidad", { length: 255 }),
  gradoAcademico: gradoEnum,
  activo: int("activo", { unsigned: true }).default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ============================================================
// PROGRAMAS ACADEMICOS
// ============================================================
export const programas = mysqlTable("programas", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  descripcion: text("descripcion"),
  duracion: varchar("duracion", { length: 100 }),
  activo: int("activo", { unsigned: true }).default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ============================================================
// AULAS
// ============================================================
export const aulas = mysqlTable("aulas", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  ubicacion: varchar("ubicacion", { length: 255 }),
  capacidad: int("capacidad", { unsigned: true }).default(30),
  recursos: json("recursos").$type<string[]>(),
  activo: int("activo", { unsigned: true }).default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ============================================================
// CLASES
// ============================================================
export const clases = mysqlTable("clases", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  programaId: int("programa_id", { unsigned: true }).references(() => programas.id),
  docenteId: int("docente_id", { unsigned: true }).references(() => docentes.id),
  aulaId: int("aula_id", { unsigned: true }).references(() => aulas.id),
  horario: varchar("horario", { length: 100 }),
  diaSemana: diaSemanaEnum,
  activo: int("activo", { unsigned: true }).default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ============================================================
// CRITERIOS (secciones de evaluacion)
// ============================================================
export const criteriosCoordinador = mysqlTable("criterios_coordinador", {
  id: serial("id").primaryKey(),
  seccion: varchar("seccion", { length: 100 }).notNull(),
  orden: int("orden", { unsigned: true }).notNull(),
  descripcion: text("descripcion").notNull(),
});

export const criteriosSupervision = mysqlTable("criterios_supervision", {
  id: serial("id").primaryKey(),
  seccion: varchar("seccion", { length: 100 }).notNull(),
  orden: int("orden", { unsigned: true }).notNull(),
  descripcion: text("descripcion").notNull(),
});

// ============================================================
// EVALUACIONES COORDINADOR
// ============================================================
export const evaluacionesCoordinador = mysqlTable("evaluaciones_coordinador", {
  id: serial("id").primaryKey(),
  docenteId: int("docente_id", { unsigned: true }).references(() => docentes.id).notNull(),
  evaluadorId: int("evaluador_id", { unsigned: true }).references(() => localUsers.id),
  fecha: varchar("fecha", { length: 20 }).notNull(),
  periodo: varchar("periodo", { length: 100 }).notNull(),
  calificaciones: json("calificaciones").$type<Record<string, number>>(),
  notaCarpeta: float("nota_carpeta"),
  notaDesempeno: float("nota_desempeno"),
  notaPerfil: float("nota_perfil"),
  calificacionTotal: float("calificacion_total"),
  comentarios: text("comentarios"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ============================================================
// EVALUACIONES SUPERVISION
// ============================================================
export const evaluacionesSupervision = mysqlTable("evaluaciones_supervision", {
  id: serial("id").primaryKey(),
  docenteId: int("docente_id", { unsigned: true }).references(() => docentes.id).notNull(),
  evaluadorId: int("evaluador_id", { unsigned: true }).references(() => localUsers.id),
  aula: varchar("aula", { length: 255 }),
  programaAcademico: varchar("programa_academico", { length: 255 }),
  clase: varchar("clase", { length: 255 }),
  fecha: varchar("fecha", { length: 20 }).notNull(),
  periodo: varchar("periodo", { length: 100 }).notNull(),
  calificacionesDocente: json("calificaciones_docente").$type<Record<string, number>>(),
  calificacionesEstudiantes: json("calificaciones_estudiantes").$type<Record<string, number>>(),
  calificacionesEspacio: json("calificaciones_espacio").$type<Record<string, number>>(),
  notaDocente: float("nota_docente"),
  notaEstudiantes: float("nota_estudiantes"),
  notaEspacioFisico: float("nota_espacio_fisico"),
  comentarioGeneral: text("comentario_general"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ============================================================
// REPORTES GENERADOS (historial de informes Word)
// ============================================================
export const reportesGenerados = mysqlTable("reportes_generados", {
  id: serial("id").primaryKey(),
  tipo: varchar("tipo", { length: 50 }).notNull(),
  periodoInicio: varchar("periodo_inicio", { length: 20 }).notNull(),
  periodoFin: varchar("periodo_fin", { length: 20 }).notNull(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  contenidoResumen: text("contenido_resumen"),
  generadoPor: int("generado_por", { unsigned: true }).references(() => localUsers.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ============================================================
// TYPES
// ============================================================
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type LocalUser = typeof localUsers.$inferSelect;
export type Docente = typeof docentes.$inferSelect;
export type Programa = typeof programas.$inferSelect;
export type Aula = typeof aulas.$inferSelect;
export type Clase = typeof clases.$inferSelect;
export type CriterioCoordinador = typeof criteriosCoordinador.$inferSelect;
export type CriterioSupervision = typeof criteriosSupervision.$inferSelect;
export type EvaluacionCoordinador = typeof evaluacionesCoordinador.$inferSelect;
export type EvaluacionSupervision = typeof evaluacionesSupervision.$inferSelect;
export type ReporteGenerado = typeof reportesGenerados.$inferSelect;
