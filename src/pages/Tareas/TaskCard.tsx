import "./TaskCard.css";
import { Tarea } from "../../types/Tarea"; // ajusta la ruta a donde la pongas
import { useEffect } from "react";

interface TaskCardProps {
    tarea: Tarea;
    onSeleccion: (tarea: Tarea) => void;
}



export default function TaskCard({ tarea, onSeleccion }: TaskCardProps) {

    return (
        <article className="task-card">
            <div className="task-card-content">
                <h2>{tarea.titulo}</h2>

                <p className="task-description">
                    {tarea.descripcion}
                </p>

                <p className="task-date">
                    Creada: {tarea.fecha}
                </p>
            </div>

            <div className="task-progress">
                <div className="task-progress-header">
                    <span>Progreso</span>
                    <span>{tarea.progreso}%</span>
                </div>

                <div className="progress-bar">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${tarea.progreso}%` }}
                    />
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => onSeleccion(tarea)}
                >
                    Ver detalles
                </button>
            </div>
        </article>
    );
}