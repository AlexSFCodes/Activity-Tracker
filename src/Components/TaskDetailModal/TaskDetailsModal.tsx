import "./TaskDetailsModal.css"

export default function TaskDetailsModal() {
    return (
        <div className="task-details-modal__overlay">
            <section className="task-details-modal">
                <button className="task-details-modal__close">
                    ✕
                </button>
                <h1 className="task-details-modal__title">Que quieres lograr?</h1>
                <input className="task-details-modal__input" placeholder="Ej. Terminar el informe" />
                <button className="task-details-modal__primary">Iniciar</button>
            </section>
        </div>
    )
}