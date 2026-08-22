export {};

declare global {
  interface Window {
    api: {
      crearTarea: (
        titulo: string,
        descripcion: string
      ) => Promise<{ id: number }>;
      mostrarTareas: () => Promise<Array<{
        id: number;
        titulo: string;
        descripcion: string;
        fecha: string;
      }>>;
    };
  }     
}
interface Tarea {
    id: number;
    titulo: string;
    descripcion: string;
    fecha: string;
    progreso: number;
}