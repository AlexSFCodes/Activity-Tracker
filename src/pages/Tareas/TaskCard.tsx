import "./TaskCard.css";

interface TaskCardProps {
    title: string;
    description: string;
    creationDate: string;
    progress: number;
}

export default function TaskCard({
    title,
    description,
    creationDate,
    progress,
}: TaskCardProps) {
    return (
        <article className="task-card">
            <div className="task-card-content">
                <h2>{title}</h2>

                <p className="task-description">
                    {description}
                </p>

                <p className="task-date">
                    Creada: {creationDate}
                </p>
            </div>

            <div className="task-progress">
                <div className="task-progress-header">
                    <span>Progreso</span>
                    <span>{progress}%</span>
                </div>

                <div className="progress-bar">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <button className="btn bt n-primary"> Ver detalles </button>
            </div>
        </article>
    );
}