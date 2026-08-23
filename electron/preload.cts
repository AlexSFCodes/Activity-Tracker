const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  crearTarea: (titulo: string, descripcion: string) =>
    ipcRenderer.invoke("tarea:crear", titulo, descripcion),
  mostrarTareas: () => 
    ipcRenderer.invoke("tarea:listar"),
});