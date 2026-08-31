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
interface Paso {
    id: number;
    tarea_id: number;
    titulo: string;
    completado: number;
    orden: number;
}
interface TaskInfoModalProps {
    OnClose: () => void;
    Task: Tarea;
}

function TaskInfoModal({ OnClose, Task }: TaskInfoModalProps) {
    const [sesiones, setSesiones] = useState<Sesion[]>([]);
    const [pasos, setPasos] = useState<Paso[]>([]);

    useEffect(() => {
        const obtenerDatos = async () => {
            const sesionesData = await window.api.sesionesTarea(Task.id);
            setSesiones(sesionesData);

            const pasosData = await window.api.listarPasosTarea(Task.id);
            setPasos(pasosData);
        };

        obtenerDatos();
    }, [Task.id]);

    const handleDelete = async () => {
        if (confirm("¿Estás seguro de que quieres eliminar esta tarea? Todas sus sesiones y pasos se borrarán para siempre.")) {
            await window.api.borrarTarea(Task.id);
            OnClose();
            window.location.reload();
        }
    };

    const porcentaje = pasos.length > 0
        ? Math.round((pasos.filter(p => p.completado === 1).length / pasos.length) * 100)
        : Task.progreso;

    const sesionesCompletadas = sesiones.length;

    // Cálculo del anillo de progreso (SVG)
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (porcentaje / 100) * circumference;

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

                {/* Nombre de la tarea */}
                <div className="task-info-modal__header">
                    <h2 className="task-info-modal__title">{Task.titulo}</h2>
                </div>

                <div className="task-info-modal__content">

                    {/* Contenedor: Progreso actual */}
                    <div className="task-info-modal__progress">
                        <div className="task-info-modal__progress-info">
                            <span className="task-info-modal__progress-label">Progreso actual</span>
                            <strong className="task-info-modal__progress-value">{porcentaje}%</strong>
                            <p className="task-info-modal__progress-sub">
                                {sesionesCompletadas} {sesionesCompletadas === 1 ? "Sesión completada" : "Sesiones completadas"}
                            </p>
                        </div>

                        <svg className="task-info-modal__progress-ring" width="88" height="88" viewBox="0 0 88 88">
                            <circle
                                className="task-info-modal__progress-ring-track"
                                cx="44"
                                cy="44"
                                r={radius}
                                fill="none"
                                strokeWidth="8"
                            />
                            <circle
                                className="task-info-modal__progress-ring-value"
                                cx="44"
                                cy="44"
                                r={radius}
                                fill="none"
                                strokeWidth="8"
                                strokeDasharray={circumference}
                                strokeDashoffset={dashOffset}
                                strokeLinecap="round"
                                transform="rotate(-90 44 44)"
                            />
                        </svg>
                    </div>
                    {/* fin contenedor progreso */}

                    <div className="task-info-modal__section">
                        <h3>Descripción</h3>
                        <p>{Task.descripcion}</p>
                    </div>

                    {/* Pasos sugeridos */}
                    <h3 className="task-info-modal__group-title">Pasos sugeridos</h3>
                    <div className="task-info-modal__steps-box">
                        <ul className="task-info-modal__steps-list">
                            {pasos.length > 0 ? (
                                pasos.map((paso) => (
                                    <li key={paso.id} className="task-info-modal__step-item">
                                        <input type="checkbox" checked={paso.completado === 1} readOnly />
                                        <span style={{ textDecoration: paso.completado === 1 ? 'line-through' : 'none', color: paso.completado === 1 ? '#999' : 'inherit' }}>
                                            {paso.titulo}
                                        </span>
                                    </li>
                                ))
                            ) : (
                                <p className="task-info-modal__empty">No hay pasos registrados.</p>
                            )}
                        </ul>
                    </div>
                    {/* fin contenedor pasos */}

                    {/* Sesiones dedicadas */}
                    <h3 className="task-info-modal__group-title">Sesiones dedicadas</h3>
                    <div className="task-info-modal__sessions-box">
                        {sesiones.length > 0 ? (
                            <ul className="task-info-modal__sessions-list">
                                {sesiones.map((sesion) => (
                                    <li key={sesion.id} className="task-info-modal__session-item">
                                        <span>{sesion.logro}</span>
                                        <small className="task-info-modal__time-badge">{sesion.tiempo} min</small>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="task-info-modal__empty">No hay sesiones registradas.</p>
                        )}
                    </div>
                    {/* fin contenedor sesiones */}

                    {/* Eliminar tarea al final */}
                    <div className="task-info-modal__delete-wrapper">
                        <button type="button" className="task-info-modal__delete-btn" onClick={handleDelete}>
                            Eliminar Tarea
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskInfoModal;