import "./TaskCard.css";
import type { Tarea } from "../../types";

interface TaskCardProps {
    tarea: Tarea;
    onSeleccion: (tarea: Tarea) => void;
    progreso: number;
}



export default function TaskCard({ tarea, onSeleccion, progreso }: TaskCardProps) {

    return (
        <article className="task-card">
            <div className="task-card-content">
                <span className="task-card-label">En progreso</span>
                <h2>{tarea.titulo}</h2>

                <p className="task-description">
                    {tarea.descripcion || "Esta tarea no tiene una descripción."}
                </p>

                <p className="task-date">
                    <i className="far fa-calendar" aria-hidden="true" />
                    <span>Creada: {tarea.fecha}</span>
                </p>
            </div>

            <div className="task-progress">
                <div className="task-progress-header">
                    <span>Progreso</span>
                    <strong>{progreso}%</strong>
                </div>

                <div
                    className="progress-bar"
                    role="progressbar"
                    aria-label={`Progreso de ${tarea.titulo}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progreso}
                >
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${progreso}%` }}
                    />
                </div>
                <button
                    className="task-card-button"
                    onClick={() => onSeleccion(tarea)}
                >
                    <span>Ver detalles</span>
                    <i className="fas fa-arrow-right" aria-hidden="true" />
                </button>
            </div>
        </article>
    );
}
