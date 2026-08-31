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
            window.location.reload(); // Recargar para actualizar la lista de tareas
        }
    };

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
                            <strong>
                                {pasos.length > 0
                                    ? Math.round((pasos.filter(p => p.completado === 1).length / pasos.length) * 100)
                                    : Task.progreso}%
                            </strong>
                        </div>
                        <div>
                            <span>Sesiones</span>
                            <strong>{sesiones.length}</strong>
                        </div>
                    </div>
                    <button type="button" className="task-info-modal__delete-btn" onClick={handleDelete}>
                        Eliminar Tarea
                    </button>
                    <div className="task-info-modal__sessions">
                        <div className="task-info-modal__sessions-header">
                            <h3>Pasos sugeridos</h3>
                        </div>
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
                                <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>No hay pasos registrados.</p>
                            )}
                        </ul>
                    </div>

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