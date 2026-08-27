import { useState, useEffect } from "react";
import "./PomodoroStartModal.css";

interface Tarea {
    id: number;
    titulo: string;
    descripcion: string;
    fecha: string;
    progreso: number;
}

interface PomodoroStartModalProps {
    onClose: () => void;
    onIniciar: (task?: Tarea) => void;
}
export default function PomodoroStartModal({ onClose, onIniciar }: PomodoroStartModalProps) {
    const [busqueda, setBusqueda] = useState("");
    const [tareas, setTareas] = useState<Tarea[]>([]);
    async function fetchTareas() {
        try {
            const tareasObtenidas = await window.api.mostrarTareas();
            setTareas(tareasObtenidas);
        } catch (err) {
            console.error("Error al obtener las tareas:", err);
        }
    }

    useEffect(() => {
        fetchTareas();
    }, []);

    const resultados = busqueda.trim() !== ""
        ? tareas.filter(task =>
            task.titulo.toLowerCase().includes(busqueda.toLowerCase())
        )
        : [];

    return (
        <div className="pomodoro-start-modal__overlay">
            <section className="pomodoro-start-modal" aria-labelledby="pomodoro-modal-title">
                <header className="pomodoro-start-modal__header">
                    <button
                        type="button"
                        className="pomodoro-start-modal__close"
                        onClick={onClose}
                        aria-label="Cerrar"
                    >
                        ✕
                    </button>
                    <span className="pomodoro-start-modal__eyebrow">Nueva sesión</span>
                    <h2 id="pomodoro-modal-title">Antes de iniciar</h2>
                    <p>Elige una tarea para mantener el enfoque o comienza una sesión libre.</p>
                </header>

                <form className="pomodoro-start-modal__form">
                    <label htmlFor="pomodoro-task">Buscar tarea</label>
                    <input
                        onChange={(e) => setBusqueda(e.target.value)}
                        id="pomodoro-task"
                        name="pomodoro-task"
                        type="text"
                        placeholder="Ej. Terminar el informe"
                    />

                    {resultados.length > 0 && (
                        <ul className="pomodoro-start-modal__results">
                            {resultados.map(task => (
                                <li key={task.id} className="pomodoro-start-modal__result">
                                    <span>{task.titulo}</span>
                                    <button
                                        type="button"
                                        className="pomodoro-start-modal__choose"
                                        onClick={onIniciar}
                                    >
                                        Escoger
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {busqueda.trim() !== "" && resultados.length === 0 && (
                        <p className="pomodoro-start-modal__empty">
                            No se encontraron tareas.
                        </p>
                    )}
                </form>

                <footer className="pomodoro-start-modal__footer">
                    <p>¿No quieres vincular una tarea?</p>
                    <button
                        className="pomodoro-start-modal__secondary"
                        type="button"
                        onClick={onIniciar}
                    >
                        Iniciar sesión libre
                    </button>
                </footer>
            </section>
        </div>
    );
}