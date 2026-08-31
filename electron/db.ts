import Database from "better-sqlite3";
import { app } from "electron";
import path from "node:path";

const dbPath = path.join(app.getPath("userData"), "tasktracker.db");

export const db: Database.Database = new Database(dbPath);
// SQLite trae las foreign keys desactivadas por defecto.
// Sin esto, el ON DELETE CASCADE no funciona.
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS tarea (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    fecha TEXT NOT NULL,
    progreso INTEGER NOT NULL DEFAULT 0 CHECK (progreso BETWEEN 0 AND 100)
  );

  CREATE TABLE IF NOT EXISTS pomodoro (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tarea_id INTEGER NOT NULL,
    tiempo REAL NOT NULL,
    fecha TEXT NOT NULL,
    logro TEXT,
    FOREIGN KEY (tarea_id) REFERENCES tarea(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS config (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    tiempo_estudio REAL NOT NULL DEFAULT 25,
    tiempo_descanso REAL NOT NULL DEFAULT 5,
    tema TEXT NOT NULL DEFAULT 'oscuro' CHECK (tema IN ('claro', 'oscuro'))
  );

  CREATE TABLE IF NOT EXISTS paso (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tarea_id INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    completado INTEGER DEFAULT 0,
    orden INTEGER NOT NULL,
    FOREIGN KEY (tarea_id) REFERENCES tarea(id) ON DELETE CASCADE
  );
`);