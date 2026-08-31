const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  crearTarea: (titulo: string, descripcion: string) =>
    ipcRenderer.invoke("tarea:crear", titulo, descripcion),
  mostrarTareas: () =>
    ipcRenderer.invoke("tarea:listar"),
  crearSesion: (tarea_id: number, descripcion: string) =>
    ipcRenderer.invoke("pomodoro:insertar", tarea_id, descripcion),
  sesionesTarea: (tarea_id: number) =>
    ipcRenderer.invoke("pomodoro:sesion", tarea_id),
  borrarTarea: (tareaId: number) =>
    ipcRenderer.invoke("tarea:borrar", tareaId),
  actualizarTiempoSesion: (sesionId: number, tiempo: number) =>
    ipcRenderer.invoke("pomodoro:actualizarTiempo", sesionId, tiempo),
  crearPaso: (tarea_id: number, titulo: string, orden: number, completado: number = 0) =>
    ipcRenderer.invoke("paso:crear", tarea_id, titulo, orden, completado),
  listarPasosTarea: (tarea_id: number) =>
    ipcRenderer.invoke("paso:listarPorTarea", tarea_id),
});