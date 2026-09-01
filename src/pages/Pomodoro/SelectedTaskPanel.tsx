import type { Paso, Tarea } from "../../types";

interface SelectedTaskPanelProps {
  task: Tarea | undefined;
  descripcion: string;
  pasos: Paso[];
  onTogglePaso: (pasoId: number) => Promise<void>;
}

export default function SelectedTaskPanel({
  task,
  descripcion,
  pasos,
  onTogglePaso,
}: SelectedTaskPanelProps) {
  return (
    <section className="pomodoro-layout task-section" aria-labelledby="selected-task-heading">
      <div className="section-heading">
        <span className="section-eyebrow">Enfoque actual</span>
        <h2 id="selected-task-heading">Tarea en curso</h2>
      </div>

      {task ? (
        <article className="selected-task-card">
          <header className="selected-task-header">
            <div>
              <span className="selected-task-label">Tarea seleccionada</span>
              <h3>{task.titulo}</h3>
            </div>
            <span className="selected-task-status">En progreso</span>
          </header>

          <p className={descripcion ? "selected-task-description" : "selected-task-description is-empty"}>
            {descripcion || "Esta sesión todavía no tiene una descripción."}
          </p>

          <fieldset className="task-steps">
            <legend>Pasos de la tarea</legend>
            {pasos.length > 0 ? (
              <ul className="task-step-list">
                {pasos.map((paso) => {
                  const completado = paso.completado === 1;
                  const inputId = `pomodoro-paso-${paso.id}`;

                  return (
                    <li className={completado ? "task-step completed" : "task-step"} key={paso.id}>
                      <input
                        id={inputId}
                        type="checkbox"
                        checked={completado}
                        onChange={() => { void onTogglePaso(paso.id); }}
                      />
                      <label htmlFor={inputId}>{paso.titulo}</label>
                      <span className="task-step-status">
                        {completado ? "Completado" : "Pendiente"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="task-steps-empty">No hay pasos registrados para esta tarea.</p>
            )}
          </fieldset>
        </article>
      ) : (
        <div className="selected-task-empty" role="status">
          <span aria-hidden="true">✓</span>
          <div>
            <h3>Aún no has seleccionado una tarea</h3>
            <p>Inicia un Pomodoro y elige una tarea para ver aquí sus pasos.</p>
          </div>
        </div>
      )}
    </section>
  );
}
