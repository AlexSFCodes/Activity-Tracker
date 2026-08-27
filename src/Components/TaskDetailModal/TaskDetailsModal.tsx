import "./TaskDetailsModal.css"

interface PomodoroTaskDetailsProps {
    onClosee: () => void;
/*     onIniciaar: () => void; */
}

export default function TaskDetailsModal({onClosee}:PomodoroTaskDetailsProps) {
    return (
        <div className="task-details-modal__overlay">
            <section className="task-details-modal">
                <button className="task-details-modal__close" onClick={onClosee}>
                    ✕
                </button>
                {/* Aqui ira programación sobre el task.nombre */}
                <h1 className="task-details-modal__title">Que quieres lograr?</h1>
                <input className="task-details-modal__input" placeholder="Ej. Terminar el informe" />
                <button className="task-details-modal__primary">Iniciar</button>
            </section>
        </div>
    )
}