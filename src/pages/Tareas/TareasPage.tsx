import TaskCard from "./TaskCard";
import "./TareasPage.css";
import TaskInfoModal from "../../Components/TaskInfoModal/TaskInfoModal";
import { useEffect, useState } from "react";
import type { Paso, Tarea } from "../../types";

export default function TareasPage() {
    const [tareas, setTareas] = useState<Tarea[]>([]);
    // Tarea seleccionada por el usuario (y controla si el modal se abre)
    const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea | null>(null);
    const [pasosPorTarea, setPasosPorTarea] = useState<Record<number, Paso[]>>({});
    const [porcentajePorTarea, setPorcentajePorTarea] = useState<Record<number, number>>({});

    async function fetchTareas() {
        try {
            const tareasObtenidas = await window.api.mostrarTareas();
            const pasosDeCadaTarea = await Promise.all(
                tareasObtenidas.map(async (tarea: Tarea) => ({
                    tarea,
                    pasos: await window.api.listarPasosTarea(tarea.id),
                }))
            );

            const nuevosPasosPorTarea: Record<number, Paso[]> = {};
            const nuevosPorcentajes: Record<number, number> = {};

            pasosDeCadaTarea.forEach(({ tarea, pasos }) => {
                nuevosPasosPorTarea[tarea.id] = pasos;
                nuevosPorcentajes[tarea.id] = pasos.length > 0
                    ? Math.round(
                        (pasos.filter((paso: Paso) => paso.completado === 1).length / pasos.length) * 100
                    )
                    : tarea.progreso;
            });

            console.log("Tareas obtenidas:", tareasObtenidas);
            setTareas(tareasObtenidas);
            setPasosPorTarea(nuevosPasosPorTarea);
            setPorcentajePorTarea(nuevosPorcentajes);
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
                    pasos={pasosPorTarea[tareaSeleccionada.id] ?? []}
                    porcentaje={porcentajePorTarea[tareaSeleccionada.id] ?? tareaSeleccionada.progreso}
                    OnClose={handleCerrarModal}
                />
            )}
            <section className="tareas-container">
                <header className="tareas-header">
                    <div>
                        <span className="tareas-eyebrow">Organiza tu avance</span>
                        <h1>Mis tareas</h1>
                        <p>Consulta tus objetivos y continúa desde donde los dejaste.</p>
                    </div>
                    <div className="tareas-counter" aria-label={`${tareas.length} tareas registradas`}>
                        <strong>{tareas.length}</strong>
                        <span>{tareas.length === 1 ? "tarea" : "tareas"}</span>
                    </div>
                </header>

                <div className="tareas-list">
                    {tareas.length > 0 ? (
                        tareas.map((tarea) => (
                            <TaskCard
                                key={tarea.id}
                                tarea={tarea}
                                onSeleccion={handleSeleccion}
                                progreso={porcentajePorTarea[tarea.id] ?? tarea.progreso}
                            />
                        ))
                    ) : (
                        <div className="tareas-empty" role="status">
                            <span aria-hidden="true"><i className="fas fa-tasks" /></span>
                            <div>
                                <h2>Aún no tienes tareas</h2>
                                <p>Crea una nueva tarea para empezar a organizar tus objetivos.</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
