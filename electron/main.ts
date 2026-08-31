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
/*
 AQUI ESTAN LOS HANDLERS PARA LA TABLA DE TAREAS

*/
//HANDLER PARA BORRAR TAREAS
ipcMain.handle("tarea:borrar", (_event, tareaId) => {
  return db.prepare("DELETE FROM tarea WHERE id = ?").run(tareaId);
});

//HANDLER PARA LISTAR TAREAS
ipcMain.handle("tarea:listar", () => {
  return db.prepare("SELECT * FROM tarea ORDER BY id DESC").all();
});

//HANDER PARA JOIN DE LAS TAREAS
ipcMain.handle("tarea:crear", (_event, titulo, descripcion) => {
  const stmt = db.prepare(
    "INSERT INTO tarea (titulo, descripcion, fecha) VALUES (?, ?, ?)"
  );
  const date = new Date().toISOString();
  const info = stmt.run(titulo, descripcion, date);
  return { id: info.lastInsertRowid };
});


/*
 AQUI ESTAN LOS HANDLERS PARA LA TABLA DE POMODORO O SESIONES DE ESTUDIO

*/

//HANDLER PARA OBTENER SESIONES DE ESTUDIO RELACIONADAS A UNA TAREA 
ipcMain.handle("pomodoro:sesion", (_event, tareaId) => {
  return db.prepare("SELECT * FROM pomodoro WHERE tarea_id = ? ORDER BY id DESC").all(tareaId);
});



//HANDELER PARA JOIN EN POMODORO

ipcMain.handle("pomodoro:insertar", (_event, tarea_id: number, descripcion: string) => {
  const stmt = db.prepare(
    "INSERT INTO pomodoro (tarea_id, tiempo, fecha, logro) VALUES (?, ?, ?, ?)"
  );
  const date = new Date().toISOString();
  const tiempo = 0;
  const info = stmt.run(tarea_id, tiempo, date, descripcion);
  return { id: info.lastInsertRowid };

});

// HANDLER PARA ACTUALIZAR EL CAMPO TIEMPO DE UNA SESION POMODORO 
ipcMain.handle("pomodoro:actualizarTiempo", (_event, sesionId, tiempo) => {
  return db.prepare("UPDATE pomodoro SET tiempo = ? WHERE id = ?").run(tiempo, sesionId);
});

// HANDLER PARA CREAR UN PASO
ipcMain.handle("paso:crear", (_event, tarea_id: number, titulo: string, orden: number, completado: number = 0) => {
  const stmt = db.prepare(
    "INSERT INTO paso (tarea_id, titulo, completado, orden) VALUES (?, ?, ?, ?)"
  );
  const info = stmt.run(tarea_id, titulo, completado, orden);
  return { id: info.lastInsertRowid };
});

// HANDLER PARA OBTENER PASOS DE UNA TAREA
ipcMain.handle("paso:listarPorTarea", (_event, tarea_id: number) => {
  return db.prepare("SELECT * FROM paso WHERE tarea_id = ? ORDER BY orden ASC").all(tarea_id);
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
