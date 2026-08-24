import { useState } from "react";
import "./PomodoroStartModal.css";
const tasks = [
    {
        id: 1,
        title: "Estudiar React",
        description: "Repasar useState y useEffect"
    },
    {
        id: 2,
        title: "Hacer ejercicio",
        description: "Correr 5 km"
    },
    {
        id: 3,
        title: "Estudiar Node.js",
        description: "Repasar Express"
    }
];


export default function PomodoroStartModal() {
    const [busqueda, SetBusqueda ] = useState("");

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
                <p> {busqueda.trim() !== "" &&tasks
    .filter(task =>
        task.title.toLowerCase().includes(busqueda.toLowerCase())
    )
    .map(task => (
        <p key={task.id}>{task.title}</p>
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
