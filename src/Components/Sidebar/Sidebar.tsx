import "./Sidebar.css";
export default function SideBar() {
    return (
        <div className="sidebar">
            <div className="logo">
                <i className="fas fa-check-circle"></i>
                <h1>TaskTracker</h1>
            </div>
            <ul>
                <li>
                    <i className="fas fa-tasks"></i>
                    <span>Tareas</span>
                </li>
                <li>
                    <i className="fas fa-plus-circle"></i>
                    <span>Nueva Tarea</span>
                </li>
                <li>
                    <i className="fas fa-chart-line"></i>
                    <span>Progreso</span>
                </li>
                <li className="active">
                    <i className="fas fa-cog"></i>
                    <span>Configuración</span>
                </li>
            </ul>
        </div>
    );
}