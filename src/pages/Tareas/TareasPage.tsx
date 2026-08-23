import TaskCard from "./TaskCard";
import "./TareasPage.css";
import { useEffect, useState } from "react";
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

export default function TareasPage() {
    const [tareas, setTareas] = useState<Tarea[]>([]);

    async function fetchTareas() {
        try {
            const tareasObtenidas = await window.api.mostrarTareas();

            console.log("Tareas obtenidas:", tareasObtenidas);
            setTareas(tareasObtenidas);
        } catch (err) {
            console.error("Error al obtener las tareas:", err);
        }
    }

    useEffect(() => {
        fetchTareas();
    }, []);

    return (
        <main className="tareas-page">
            <section className="tareas-container">
                <header className="tareas-header">
                    <h1>Mis tareas</h1>
                    <p>Lista de tareas</p>
                </header>

                <div className="tareas-list">
                    {tareas.map((tarea) => (
                        <TaskCard
                            key={tarea.id}
                            title={tarea.titulo}
                            description={tarea.descripcion}
                            creationDate={tarea.fecha}
                            progress={tarea.progreso}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}