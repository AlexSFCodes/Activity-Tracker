const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  crearTarea: (titulo: string, descripcion: string) =>
    ipcRenderer.invoke("tarea:crear", titulo, descripcion),
  mostrarTareas: () => 
    ipcRenderer.invoke("tarea:listar"),
crearSesion: (tarea_id: number, descripcion: string) =>
  ipcRenderer.invoke("pomodoro:insertar", tarea_id, descripcion),
  
});