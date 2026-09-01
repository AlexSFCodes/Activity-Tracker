import TaskCard from "./TaskCard";
import "./TareasPage.css";
import TaskInfoModal from "../../Components/TaskInfoModal/TaskInfoModal";
import { useEffect, useState } from "react";
import type { Tarea } from "../../types";

export default function TareasPage() {
    const [tareas, setTareas] = useState<Tarea[]>([]);
    // Tarea seleccionada por el usuario (y controla si el modal se abre)
    const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea | null>(null);

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

    function handleSeleccion(tarea: Tarea) {
        setTareaSeleccionada(tarea);
    }

    function handleCerrarModal() {
        setTareaSeleccionada(null);
    }

    return (
        <main className="tareas-page">
            {tareaSeleccionada && (
                <TaskInfoModal
                    Task={tareaSeleccionada}
                    OnClose={handleCerrarModal}
                />
            )}
            <section className="tareas-container">
                <header className="tareas-header">
                    <h1>Mis tareas</h1>
                    <p>Lista de tareas</p>
                </header>

                <div className="tareas-list">
                    {tareas.map((tarea) => (
                        <TaskCard
                            key={tarea.id}
                            tarea={tarea}
                            onSeleccion={handleSeleccion}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}
