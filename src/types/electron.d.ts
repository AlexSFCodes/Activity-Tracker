export { };

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  progreso: number;
}
interface Sesion {
  id: number,
  tarea_id: number,
  tiempo: number,
  logro: string,
  fecha: string
}

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
    };
  }
}