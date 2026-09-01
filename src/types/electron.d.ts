import type { Paso, Sesion, Tarea } from "./index";

declare global {
  interface Window {
    api: {
      crearTarea: (
        titulo: string,
        descripcion: string
      ) => Promise<{ id: number }>;
      mostrarTareas: () => Promise<Tarea[]>;
      crearSesion: (
        tarea_id: number,
        descripcion: string
      ) => Promise<{ id: number }>;
      sesionesTarea: (tarea_id: number) => Promise<Sesion[]>;

      borrarTarea: (tareaId: number) => Promise<void>;
      actualizarTiempoSesion: (sesionId: number, tiempo: number) => Promise<{ id: number }>;
      crearPaso: (
        tarea_id: number,
        titulo: string,
        orden: number,
        completado?: number
      ) => Promise<{ id: number }>;
      listarPasosTarea: (tarea_id: number) => Promise<Paso[]>;
      actualizarPasoCompletado: (pasoId: number, tareaId: number) => Promise<number>;
    };
  }
}

export {};
