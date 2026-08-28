import "./TaskDetailsModal.css"
import { useState } from "react";
interface PomodoroTaskDetailsProps {
    onClosee: () => void;
    onIniciaar: (descripcion:string) => void; 
}

export default function TaskDetailsModal({onClosee, onIniciaar}:PomodoroTaskDetailsProps) {
    const [descripcion, setDescripcion] = useState("");
    return (
        <div className="task-details-modal__overlay">
            <section className="task-details-modal">
                <button className="task-details-modal__close" onClick={onClosee}>
                    ✕
                </button>
                {/* Aqui ira programación sobre el task.nombre */}
                <h1 className="task-details-modal__title">Que quieres lograr?</h1>
                <input className="task-details-modal__input" placeholder="Ej. Terminar el informe" onChange={(e) => setDescripcion(e.target.value)} />
                {descripcion}
                <button className="task-details-modal__primary" onClick={()=>onIniciaar(descripcion)}>Iniciar</button>
            </section>
        </div>
    )
}