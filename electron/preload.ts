import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // acá vas a ir agregando funciones a medida que las necesites
  // ejemplo:
  // ping: () => ipcRenderer.invoke("ping"),
});