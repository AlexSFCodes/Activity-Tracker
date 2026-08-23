export {};

interface Tarea {
    id: number;
    titulo: string;
    descripcion: string;
    fecha: string;
    progreso: number;
}

declare global {
  interface Window {
    api: {
      crearTarea: (
        titulo: string,
        descripcion: string
      ) => Promise<{ id: number }>;
      mostrarTareas: () => Promise<Tarea[]>;
    };
  }
}