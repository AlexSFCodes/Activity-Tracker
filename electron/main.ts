import { app, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "./db.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//IMPORTACION DE IPCMAIN PARA COMUNICACION ENTRE PROCESOS
import { ipcMain } from "electron";
import { db } from "./db.js";


const isDev = !app.isPackaged;
/*
HANDLERS DE IPC PARA COMUNICACION ENTRE PROCESOS

*/
//HANDLER PARA LISTAR TAREAS
ipcMain.handle("tarea:listar", () => {
  return db.prepare("SELECT * FROM tarea ORDER BY id DESC").all();
});

//HANDLER PARA CARGAR TODOS LOS CICLOS POMODOROS RELACIONADOS A LA TAREA
ipcMain.handle("pomodoro:listar", (_event, tareaId) => {
  return db
    .prepare("SELECT * FROM pomodoro WHERE tarea_id = ? ORDER BY id DESC")
    .all(tareaId);
});

//HANDER PARA JOIN DE LAS TAREAS
ipcMain.handle("tarea:crear", (_event, titulo, descripcion) => {
  const stmt = db.prepare(
    "INSERT INTO tarea (titulo, descripcion, fecha) VALUES (?, ?, ?)"
  );
  const date = new Date().toISOString();
  const info = stmt.run(titulo, descripcion,date);
  return { id: info.lastInsertRowid };
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "../dist-renderer/index.html"));
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
