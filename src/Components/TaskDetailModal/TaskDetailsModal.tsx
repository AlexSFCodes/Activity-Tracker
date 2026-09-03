import { useState, type FormEvent } from "react";
import "./TaskDetailsModal.css";

interface PomodoroTaskDetailsProps {
    taskTitle: string;
    onClose: () => void;
    onStart: (descripcion: string) => void;
}

export default function TaskDetailsModal({ taskTitle, onClose, onStart }: PomodoroTaskDetailsProps) {
    const [descripcion, setDescripcion] = useState("");

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onStart(descripcion.trim());
    }

    return (
        <div className="task-details-modal__overlay" role="presentation">
            <section className="task-details-modal" role="dialog" aria-modal="true"
                aria-labelledby="task-details-modal-title" aria-describedby="task-details-modal-description">
                <header className="task-details-modal__header">
                    
                    <span className="task-details-modal__eyebrow">Objetivo de la sesión</span>
                    <h2 id="task-details-modal-title">¿Qué quieres lograr?</h2>
                    <p id="task-details-modal-description">
                        Define un resultado concreto para mantener el enfoque durante este Pomodoro.
                    </p>
                </header>

                <div className="task-details-modal__task">
                    <span>Tarea seleccionada</span>
                    <strong>{taskTitle}</strong>
                </div>

                <form className="task-details-modal__form" onSubmit={handleSubmit}>
                    <label htmlFor="pomodoro-session-goal">Objetivo</label>
                    <textarea id="pomodoro-session-goal" value={descripcion} maxLength={180} rows={4}
                        placeholder="Ej. Terminar la introducción del informe"
                        onChange={(event) => setDescripcion(event.target.value)} autoFocus />
                    <span className="task-details-modal__counter" aria-live="polite">{descripcion.length}/180</span>

                    <footer className="task-details-modal__actions">
                        <button className="task-details-modal__secondary" type="button" onClick={onClose}>Cancelar</button>
                        <button className="task-details-modal__primary" type="submit">Iniciar Pomodoro</button>
                    </footer>
                </form>
            </section>
        </div>
    );
}
