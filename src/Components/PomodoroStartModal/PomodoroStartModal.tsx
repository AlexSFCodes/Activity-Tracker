import { useState, useEffect } from "react";
import "./PomodoroStartModal.css";

interface Tarea {
    id: number;
    titulo: string;
    descripcion: string;
    fecha: string;
    progreso: number;
}

export default function PomodoroStartModal() {
    const [busqueda, SetBusqueda ] = useState("");
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
        
        <section className="pomodoro-start-modal" aria-labelledby="pomodoro-modal-title">
            <header className="pomodoro-start-modal__header">
                <span className="pomodoro-start-modal__eyebrow">Nueva sesión</span>
                <h2 id="pomodoro-modal-title">Antes de iniciar</h2>
                <p>Elige una tarea para mantener el enfoque o comienza una sesión libre.</p>
            </header>

            <form className="pomodoro-start-modal__form">
                <label htmlFor="pomodoro-task">Buscar tarea</label>
                <input 
                    onChange={(e) => SetBusqueda(e.target.value)}
                    id="pomodoro-task"
                    name="pomodoro-task"
                    type="text"
                    placeholder="Ej. Terminar el informe"
                />
                <p> {busqueda.trim() !== "" && tareas
    .filter(task =>
        task.titulo.toLowerCase().includes(busqueda.toLowerCase())
    )
    .map(task => (
        <p key={task.id}>{task.titulo}</p>
    ))
}</p>
            </form>

            <footer className="pomodoro-start-modal__footer">
                <p>¿No quieres vincular una tarea?</p>
                <button className="pomodoro-start-modal__secondary" type="button">
                    Iniciar sesión libre
                </button>
            </footer>
        </section>
    );
}
