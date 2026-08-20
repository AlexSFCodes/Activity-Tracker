import Sidebar from "./Components/Sidebar/Sidebar";
import TareasPage from "./pages/Tareas/TareasPage";
import NewTaskPage from "./pages/NuevaTarea/NewTaskPage";
function App() {
  return (
    <div className="app">
      <Sidebar />
      <NewTaskPage />
      {/* <TareasPage /> */}

    </div>
  );
}


export default App;