import { useEffect, useState } from "react";
import "./TaskInfoModal.css";

interface Tarea {
    id: number;
    titulo: string;
    descripcion: string;
    fecha: string;
    progreso: number;
}
interface Sesion {
    id: number,
    tarea_id: number,
    tiempo: number,
    logro: string,
    fecha: string
}
interface TaskInfoModalProps {
    OnClose: () => void;
    Task: Tarea;
}

function TaskInfoModal({ OnClose, Task }: TaskInfoModalProps) {
    const [sesiones, setSesiones] = useState<Sesion[]>([]);
    useEffect(() => {
        const obtenerSesiones = async () => {
            console.log("La tarea seleccionada es: ", Task.id);
            const sesiones = await window.api.sesionesTarea(Task.id);
            setSesiones(sesiones);
            console.log("Sesiones encontradas: ", sesiones);
        };

        obtenerSesiones();
    }, [Task.id]);
    return (
        <div className="task-info-modal__overlay">
            <div className="task-info-modal">
                <button
                    className="task-info-modal__close"
                    type="button"
                    aria-label="Cerrar modal"
                    onClick={OnClose}
                >
                    ✕
                </button>

                <div className="task-info-modal__badge">Tarea</div>

                <div className="task-info-modal__header">
                    <p className="task-info-modal__eyebrow">Nombre</p>
                    <h2 className="task-info-modal__title">{Task.titulo}</h2>
                </div>

                <div className="task-info-modal__content">
                    <div className="task-info-modal__section">
                        <h3>Descripción</h3>
                        <p>
                            {Task.descripcion}
                        </p>
                    </div>

                    <div className="task-info-modal__stats">
                        <div>
                            <span>Progreso</span>
                            <strong>0%</strong>
                        </div>
                        <div>
                            <span>Sesiones</span>
                            <strong>0</strong>
                        </div>
                    </div>
                    <button type="button" className="task-info-modal__delete-btn">
                        Eliminar Tarea
                    </button>
                    <div className="task-info-modal__sessions">
                        <div className="task-info-modal__sessions-header">
                            <h3>Sesiones dedicadas</h3>
                        </div>
                        {
                            sesiones.map((sesion) => (
                                <li key={sesion.id}>
                                    <span>Objetivo: {sesion.logro}</span>
                                    <small>Tiempo dedicado:{sesion.tiempo} min</small>
                                </li>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskInfoModal;