import TaskCard from "./TaskCard";
import "./TareasPage.css";
export default function TareasPage() {
    const tareas = [
        { id: 1, title: "Task 1", description: "Description for Task 1", creationDate: "2023-10-15", progress: 100 },
        { id: 2, title: "Task 2", description: "Description for Task 2", creationDate: "2023-10-16", progress: 80 },
        { id: 3, title: "Task 3", description: "Description for Task 3", creationDate: "2023-10-17", progress: 40 },
    ];
    return (
        
        <div className="tareas-page">
            <h1>Mis Tareas</h1>
            <p>Lista de tareas</p>
        {tareas.map((tarea) => (
            <TaskCard
                key={tarea.id}
                title={tarea.title}
                description={tarea.description}
                creationDate={tarea.creationDate}
                progress={tarea.progress}
            />
        ))}
        </div>
    )
}
interface TaskCardProps {
    title: string;
    description: string;
    creationDate: string;
    progress: number; // Progress percentage (0-100)
}
