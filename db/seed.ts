import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import * as schema from "./schema";
import "dotenv/config";

const pool = createPool(process.env.DATABASE_URL!);
const db = drizzle(pool, { schema });

async function seed() {
  console.log("Seeding database...");

  // Seed Criterios Coordinador
  const criteriosCoordData = [
    { seccion: "Carpeta Docente", orden: 1, descripcion: "Completa con anuencia y puntualidad el proceso de contratacion." },
    { seccion: "Carpeta Docente", orden: 2, descripcion: "Mantiene su hoja de vida actualizada." },
    { seccion: "Carpeta Docente", orden: 3, descripcion: "Entrega la planificacion academica actualizada y conforme al silabo, previo a iniciar el periodo de clases." },
    { seccion: "Carpeta Docente", orden: 4, descripcion: "Define claramente las rubricas de evaluacion para los trabajos planificados." },
    { seccion: "Carpeta Docente", orden: 5, descripcion: "Da seguimiento a la asistencia estudiantil." },
    { seccion: "Carpeta Docente", orden: 6, descripcion: "Registra y firma puntualmente las calificaciones finales." },
    { seccion: "Desempeno Docente", orden: 1, descripcion: "Da cumplimiento al horario establecido de inicio y final de clases." },
    { seccion: "Desempeno Docente", orden: 2, descripcion: "Demuestra preparacion academica y profesional para impartir la clase, tanto en el material utilizado como en el abordaje de tematica." },
    { seccion: "Desempeno Docente", orden: 3, descripcion: "El docente es innovador y emplea diversas estrategias metodologicas, efectivas para el proceso de ensenanza-aprendizaje." },
    { seccion: "Desempeno Docente", orden: 4, descripcion: "El docente demuestra neutralidad en temas de politica, religion y de genero en el aula de clases." },
    { seccion: "Desempeno Docente", orden: 5, descripcion: "Fomenta el desarrollo de la investigacion en los estudiantes." },
    { seccion: "Desempeno Docente", orden: 6, descripcion: "Las estrategias de ensenanza utilizadas por el docente son desafiantes, coherentes y significativas para el maestrante." },
    { seccion: "Desempeno Docente", orden: 7, descripcion: "Manifiesta dominio del tema y contenidos de la disciplina que imparte." },
    { seccion: "Desempeno Docente", orden: 8, descripcion: "Hace uso eficiente y proactivo de la plataforma virtual para el desarrollo de la clase." },
    { seccion: "Desempeno Docente", orden: 9, descripcion: "Propicia un espacio academico de respeto y buenas relaciones para el desarrollo de la actividad academica." },
    { seccion: "Desempeno Docente", orden: 10, descripcion: "Vincula la teoria de la clase con la experiencia profesional de los maestrantes." },
    { seccion: "Desempeno Docente", orden: 11, descripcion: "Evita divagaciones distractoras al tema de la clase." },
    { seccion: "Desempeno Docente", orden: 12, descripcion: "Se muestra accesible para atender las inquietudes y desempeno de los estudiantes ante el desarrollo de la clase." },
    { seccion: "Desempeno Docente", orden: 13, descripcion: "Demuestra dominio de metodologias didacticas para el desarrollo de la tematica." },
    { seccion: "Perfil Docente", orden: 1, descripcion: "Atendio puntualmente los llamados del coordinador academico." },
    { seccion: "Perfil Docente", orden: 2, descripcion: "Demuestra apertura y atencion a la critica constructiva por parte de la coordinacion." },
    { seccion: "Perfil Docente", orden: 3, descripcion: "Demuestra un comportamiento etico y profesional en el entorno de aprendizaje." },
    { seccion: "Perfil Docente", orden: 4, descripcion: "El docente hace uso de vestimenta apropiada durante la imparticion de la asignatura." },
    { seccion: "Perfil Docente", orden: 5, descripcion: "El docente tiene vocacion de servicio y sabe transmitir el conocimiento al estudiante." },
    { seccion: "Perfil Docente", orden: 6, descripcion: "El docente utiliza vocabulario adecuado y afable con los estudiantes." },
  ];
  await db.insert(schema.criteriosCoordinador).values(criteriosCoordData);
  console.log("Inserted criteriosCoordinador:", criteriosCoordData.length);

  const criteriosSupData = [
    { seccion: "Criterios del Docente", orden: 1, descripcion: "Cumple con el horario de inicio de clase." },
    { seccion: "Criterios del Docente", orden: 2, descripcion: "Hace uso de vestimenta apropiada durante la imparticion de la asignatura." },
    { seccion: "Criterios del Docente", orden: 3, descripcion: "Verifica la asistencia estudiantil." },
    { seccion: "Criterios del Docente", orden: 4, descripcion: "Demuestra preparacion academica y profesional para impartir la clase, tanto en el material utilizado como en el abordaje de tematica." },
    { seccion: "Criterios del Docente", orden: 5, descripcion: "Manifiesta dominio del tema y contenidos de la disciplina que imparte." },
    { seccion: "Criterios del Docente", orden: 6, descripcion: "La tematica impartida en aula esta acorde a la planificacion academica programada para esa semana." },
    { seccion: "Criterios del Docente", orden: 7, descripcion: "Propicia un ambiente de respeto y participacion activa en la clase." },
    { seccion: "Criterios del Docente", orden: 8, descripcion: "Hace uso adecuado y responsable de los recursos didacticos instalados en el aula de clases." },
    { seccion: "Criterios del Docente", orden: 9, descripcion: "Cumple con el tiempo definido para el receso academico." },
    { seccion: "Criterios del Docente", orden: 10, descripcion: "Cumple con el horario de fin de clase." },
    { seccion: "Criterios de los Estudiantes", orden: 1, descripcion: "Cumple con el horario de inicio de clase." },
    { seccion: "Criterios de los Estudiantes", orden: 2, descripcion: "Hace uso de vestimenta apropiada para el nivel educativo que cursa." },
    { seccion: "Criterios de los Estudiantes", orden: 3, descripcion: "Demuestra interes y participacion en las clases." },
    { seccion: "Criterios de los Estudiantes", orden: 4, descripcion: "Hace uso de recursos tecnologicos para fines netamente academicos." },
    { seccion: "Criterios de los Estudiantes", orden: 5, descripcion: "Evita distractores que impiden el desarrollo de la clase." },
    { seccion: "Criterios de los Estudiantes", orden: 6, descripcion: "Cumple con el horario de fin de clase." },
    { seccion: "Criterios del Espacio Fisico", orden: 1, descripcion: "El servicio de internet instalado en aula es eficiente." },
    { seccion: "Criterios del Espacio Fisico", orden: 2, descripcion: "Los aires acondicionados en el aula de clase son funcionales." },
    { seccion: "Criterios del Espacio Fisico", orden: 3, descripcion: "El equipo tecnologico instalado (data + computadora) no presenta fallas en su uso." },
    { seccion: "Criterios del Espacio Fisico", orden: 4, descripcion: "La pantalla tecnologica instalada funciona adecuadamente y todos sus accesorios (lapiz) estan en el aula." },
    { seccion: "Criterios del Espacio Fisico", orden: 5, descripcion: "El mobiliario del aula esta en condiciones optimas y completo en su asignacion." },
    { seccion: "Criterios del Espacio Fisico", orden: 6, descripcion: "La infraestructura del aula de clase no presenta danos." },
    { seccion: "Criterios del Espacio Fisico", orden: 7, descripcion: "La iluminacion del espacio fisico del aula y pasillos funciona adecuadamente." },
    { seccion: "Criterios del Espacio Fisico", orden: 8, descripcion: "El aseo del aula es propicio para el desarrollo de clases." },
    { seccion: "Criterios del Espacio Fisico", orden: 9, descripcion: "Los banos funcionan adecuadamente y se mantienen limpios y en orden." },
  ];
  await db.insert(schema.criteriosSupervision).values(criteriosSupData);
  console.log("Inserted criteriosSupervision:", criteriosSupData.length);

  const docentesData = [
    { nombre: "Juan Carlos", apellido: "Martinez Lopez", email: "jmartinez@udh.edu.hn", telefono: "+504 9988-7744", especialidad: "Derecho Internacional", gradoAcademico: "Doctorado" as const },
    { nombre: "Maria Elena", apellido: "Rodriguez Paz", email: "mrodriguez@udh.edu.hn", telefono: "+504 8877-6655", especialidad: "Seguridad Nacional", gradoAcademico: "Maestria" as const },
    { nombre: "Pedro Antonio", apellido: "Garcia Flores", email: "pgarcia@udh.edu.hn", telefono: "+504 7766-5544", especialidad: "Ciencias Militares", gradoAcademico: "Doctorado" as const },
    { nombre: "Ana Lucia", apellido: "Hernandez Castillo", email: "ahernandez@udh.edu.hn", telefono: "+504 6655-4433", especialidad: "Relaciones Internacionales", gradoAcademico: "Maestria" as const },
    { nombre: "Roberto Carlos", apellido: "Sanchez Mejia", email: "rsanchez@udh.edu.hn", telefono: "+504 5544-3322", especialidad: "Estrategia Militar", gradoAcademico: "Doctorado" as const },
  ];
  await db.insert(schema.docentes).values(docentesData);
  console.log("Inserted docentes:", docentesData.length);

  const programasData = [
    { nombre: "Maestria en Seguridad Nacional y Defensa", descripcion: "Programa orientado al analisis estrategico de la seguridad nacional", duracion: "2 anios" },
    { nombre: "Maestria en Gestion de Conflictos y Paz", descripcion: "Formacion en resolucion de conflictos y construccion de paz", duracion: "2 anios" },
    { nombre: "Maestria en Derecho Internacional Humanitario", descripcion: "Especializacion en DIH y derechos humanos", duracion: "18 meses" },
    { nombre: "Maestria en Inteligencia Estrategica", descripcion: "Analisis de inteligencia y contrainteligencia", duracion: "2 anios" },
  ];
  await db.insert(schema.programas).values(programasData);
  console.log("Inserted programas:", programasData.length);

  const aulasData = [
    { nombre: "Aula Magna", ubicacion: "Edificio Principal - 1er Nivel", capacidad: 40, recursos: ["Proyector", "Computadora", "Internet", "Aire Acondicionado", "Pantalla Interactiva"] },
    { nombre: "Aula de Estrategia", ubicacion: "Edificio Principal - 2do Nivel", capacidad: 30, recursos: ["Proyector", "Computadora", "Internet", "Aire Acondicionado"] },
    { nombre: "Aula de Derecho", ubicacion: "Edificio Anexo - 1er Nivel", capacidad: 35, recursos: ["Proyector", "Computadora", "Internet", "Aire Acondicionado", "Pantalla Interactiva"] },
    { nombre: "Sala de Inteligencia", ubicacion: "Edificio Anexo - 2do Nivel", capacidad: 25, recursos: ["Proyector", "Computadora", "Internet", "Aire Acondicionado", "Pantalla Interactiva", "Sistema de Videoconferencia"] },
  ];
  await db.insert(schema.aulas).values(aulasData);
  console.log("Inserted aulas:", aulasData.length);

  await db.insert(schema.localUsers).values({
    usuario: "admin",
    serie: "UDH-001",
    email: "admin@udh.edu.hn",
    password: "$2b$10$3TsjHEN9uTcgQ9rExNVseuFc1o19gDncEfw6lC6vq/rD3MATH/bVW",
    nombre: "Administrador",
    apellido: "UDH",
    role: "admin" as const,
    activo: 1,
  });
  console.log("Inserted admin user (password: admin123)");

  console.log("Seed complete!");
  await pool.end();
}

seed().catch(console.error);
