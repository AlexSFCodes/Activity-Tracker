import Sidebar from "./Components/Sidebar/Sidebar";
import TareasPage from "./pages/Tareas/TareasPage";
import NewTaskPage from "./pages/NuevaTarea/NewTaskPage";
import { useState } from "react";

function App() {
  
  const [paginaActual, setPaginaActual] = useState<"tareas" | "nuevaTarea">("nuevaTarea");
  
  return (
    <div className="app">
      <Sidebar cambiarPagina={setPaginaActual} />
      {paginaActual === "tareas" && <TareasPage />}
      {paginaActual === "nuevaTarea" && <NewTaskPage />}

    </div>
  );
}


export default App;