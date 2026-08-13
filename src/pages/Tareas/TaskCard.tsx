

import "./TaskCard.css";
export default function TaskCard(props: TaskCardProps) { 
    return (
        <div className="task-card">
            <div className="task-header">
                <h3>{props.title}</h3>
                <span className="task-status">In Progress {props.progress}%</span>
            </div>
            <p className="task-description">{props.description}</p>
            <div className="task-fecha">Fecha Creación: {props.creationDate}</div>
            <div className="task-progress">
                <div className="progress-bar" style={{ width: `${props.progress}%` }}></div>
            </div>
            <button>Ver Detalles</button>
        </div>
    );
} 

interface TaskCardProps {
    title: string;
    description: string;
    creationDate: string;
    progress: number; // Progress percentage (0-100)
}