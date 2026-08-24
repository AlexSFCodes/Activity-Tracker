import "./Sidebar.css";

type SidebarProps = {
  cambiarPagina: (pagina: "tareas" | "nuevaTarea" | "pomodoro") => void;
};

export default function SideBar({ cambiarPagina }: SidebarProps) {
    return (
        <div className="sidebar">
            <div className="logo">
                <i className="fas fa-check-circle"></i>
                <h1>TaskTracker</h1>
            </div>
            <ul>
                <li className="SidebarElement"onClick={() => cambiarPagina("tareas")}>
                    <i className="fas fa-tasks"></i>
                    <span>Tareas</span>
                </li>
                <li  className="SidebarElement" onClick={() => cambiarPagina("nuevaTarea")}>
                    <i className="fas fa-plus-circle"></i>
                    <span>Nueva Tarea</span>
                </li>
                <li  className="SidebarElement" onClick={() => cambiarPagina("pomodoro")}>
                    <i className="far fa-clock"></i>
                    <span> Pomodoro</span>
                </li>
                <li  className="SidebarElement">
                    <i className="fas fa-chart-line"></i>
                    <span>Progreso</span>
                </li>
                <li  className="active SidebarElement">
                    <i className="fas fa-cog"></i>
                    <span>Configuración</span>
                </li>
            </ul>
        </div>
    );
}