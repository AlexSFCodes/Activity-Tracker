import Sidebar from "./Components/Sidebar/Sidebar";
import TareasPage from "./pages/Tareas/TareasPage";
import NewTaskPage from "./pages/NuevaTarea/NewTaskPage";
import { useState } from "react";
import PomodoroPage from "./pages/Pomodoro/PomodoroPage";
function App() {
  
  const [paginaActual, setPaginaActual] = useState<"tareas" | "nuevaTarea" | "pomodoro">("nuevaTarea");
  
  return (
    <div className="app">
      <Sidebar cambiarPagina={setPaginaActual} />
      {paginaActual === "tareas" && <TareasPage />}
      {paginaActual === "nuevaTarea" && <NewTaskPage />}
      {paginaActual === "pomodoro" && <PomodoroPage />}

    </div>
  );
}


export default App;