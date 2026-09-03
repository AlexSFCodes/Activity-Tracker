import { useEffect, useMemo, useRef, useState } from "react";
import "./PomodoroPage.css";
import PomodoroStartModal from "../../Components/PomodoroStartModal/PomodoroStartModal"
import TaskDetailsModal from "../../Components/TaskDetailModal/TaskDetailsModal"
import type { Paso, Tarea } from "../../types";
import { DURATIONS, MODE_LABELS, type PomodoroMode } from "./pomodoro.constants";

//EL MODO DE POMODORO typos lo que puede ser esa variable
function formatTime(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function PomodoroPage() {
    const [mode, setMode] = useState<PomodoroMode>("focus");
    const [secondsLeft, setSecondsLeft] = useState(DURATIONS.focus);
    const [isRunning, setIsRunning] = useState(false);
    const [completedSessions, setCompletedSessions] = useState(0);
    // ID de la sesión actual
    const [sesionId, setSesionId] = useState<number | null>(null);
    const sesionGuardadaRef = useRef<number | null>(null);

    //tarea mandada desde el modal
    const [selectedTask, setSelectedTask] = useState<Tarea | undefined>(undefined);
    //descripcion mandada desde el modal
    const [descripcion, setDescripcion] = useState<string>("");
    // Renderizado de modales
    // MODAL ANTES DE INICIAR POMODORO
    const [startModal, setStartModal] = useState(false);


    //MODAL DESPUEES DEL PRIMER MODAL
    const [taskDetails, setTaskDetails] = useState(false);
    const [pasos, setPasos] = useState<Paso[]>([]);
    // Funcion para pomodoro


    useEffect(() => {
        if (!isRunning) return;

        const timer = window.setInterval(() => {
            setSecondsLeft(currentSeconds =>
                Math.max(currentSeconds - 1, 0)
            );
        }, 1000);

        return () => window.clearInterval(timer);
    }, [isRunning]);
    useEffect(() => {
        if (!isRunning || secondsLeft !== 0) return;

        setIsRunning(false);

        if (mode !== "focus" || sesionId === null || sesionGuardadaRef.current === sesionId) return;

        sesionGuardadaRef.current = sesionId;
        const guardarSesion = async () => {
            try {
                const minutosTrabajados = DURATIONS.focus / 60;
                await window.api.actualizarTiempoSesion(sesionId, minutosTrabajados);
                setCompletedSessions(sessions => sessions + 1);
                setSesionId(null);
                console.log("Sesión finalizada correctamente");
            } catch (error) {
                sesionGuardadaRef.current = null;
                console.error("No se pudo finalizar la sesión:", error);
            }
        };

        void guardarSesion();
    }, [secondsLeft, isRunning, mode, sesionId]);

    const progress = useMemo(
        () => ((DURATIONS[mode] - secondsLeft) / DURATIONS[mode]) * 100,
        [mode, secondsLeft],
    );

    function changeMode(nextMode: PomodoroMode) {
        setMode(nextMode);
        setSecondsLeft(DURATIONS[nextMode]);
        setIsRunning(false);
    }

    function resetTimer() {

        setIsRunning(false);
        setSecondsLeft(DURATIONS[mode]);

    }

    function handleClickIniciar() {
        if (isRunning) {
            setIsRunning(false); // pausar
            return;
        }

        if (mode === "focus" && (secondsLeft === DURATIONS.focus || secondsLeft === 0)) {
            if (secondsLeft === 0) setSecondsLeft(DURATIONS.focus);
            if (!selectedTask) {
                setStartModal(true);
            } else {
                setTaskDetails(true);
            }
            return;
        }

        if (secondsLeft === 0) {
            setSecondsLeft(DURATIONS[mode]);
        }

        setIsRunning(true); // ya había empezado antes, solo reanuda
    }

    function handleIniciarDesdeModal(task?: Tarea) {
        if (task) {
            setTaskDetails(true);
            console.log("Vos elegiste " + task.titulo);
            setSelectedTask(task);
            setStartModal(false);
            // const nuevaTarea = await window.api.crearSesion(task.titulo, descripcion);
        } else {
            setIsRunning(true);
            setStartModal(false)
        };
    }
    async function handleIniciarTareaElegida(descripcionTarea: string) {
        setTaskDetails(false);
        setDescripcion(descripcionTarea);
        if (!selectedTask) return;

        const nuevaSesion = await window.api.crearSesion(
            selectedTask.id,
            descripcionTarea
        );
        setSesionId(nuevaSesion.id);
        sesionGuardadaRef.current = null;
        console.log("Nueva sesión creada con ID:", nuevaSesion.id);
        try {
            const pasosTarea = await window.api.listarPasosTarea(selectedTask.id);
            setPasos(pasosTarea);
        } catch (error) {
            console.error("Error al obtener las sesiones de la tarea:", error);
        }
        setIsRunning(true);
    }
    async function handleMarcarPasoCompletado(pasoId: number) {
        if (!selectedTask) return;
        try {
            const resultado = await window.api.actualizarPasoCompletado(pasoId, selectedTask.id);
            console.log(`Paso con ID ${pasoId} actualizado. Filas afectadas: ${resultado}`);
            const pasosTarea = await window.api.listarPasosTarea(selectedTask.id);
            setPasos(pasosTarea);
        } catch (error) {
            console.error("Error al actualizar el paso:", error);
        }

    }
    return (

        <main className="pomodoro-page">
            {/*EL SEGUNDO MODAL A CAMBIAR */}
            {taskDetails && selectedTask && (
                <TaskDetailsModal
                    taskTitle={selectedTask.titulo}
                    onClose={() => setTaskDetails(false)}
                    onStart={handleIniciarTareaElegida}
                />
            )}
            {/* El primer modal a cambiar */}
            {startModal && (
                <PomodoroStartModal
                    onClose={() => setStartModal(false)}
                    onIniciar={handleIniciarDesdeModal}
                />
            )}

            <header className="pomodoro-header">
                <div className="pomodoro-heading">
                    <h1>Pomodoro</h1>
                    <p>Trabaja con intención, descansa y mantén el ritmo.</p>
                </div>
                <p className="session-counter" aria-label={`${completedSessions} sesiones completadas`}>
                    <span className="session-counter-number">{completedSessions}</span>
                    <span>sesiones<br />completadas</span>
                </p>
            </header>

            <div className="pomodoro-content">
                <section className="pomodoro-layout" aria-labelledby="timer-heading">
                    <h2 id="timer-heading" className="visually-hidden">Temporizador Pomodoro</h2>
                    <div className="timer-card">
                        <div className="mode-tabs" aria-label="Modo del temporizador">
                            {(Object.keys(MODE_LABELS) as PomodoroMode[]).map((item) => (
                                <button
                                    key={item}
                                    className={mode === item ? "mode-tab active" : "mode-tab"}
                                    type="button"
                                    aria-pressed={mode === item}
                                    onClick={() => changeMode(item)}>
                                    {MODE_LABELS[item]}
                                </button>
                            ))}
                        </div>

                        <div className="pomodoro-timer" style={{ "--progress": `${progress}%` } as React.CSSProperties}>
                            <div className="timer-inner">
                                <span className="timer-label">{MODE_LABELS[mode]}</span>
                                <time className="timer-time" dateTime={`PT${secondsLeft}S`}>{formatTime(secondsLeft)}</time>
                                <span className="timer-status" aria-live="polite">
                                    {isRunning ? "En curso" : secondsLeft === 0 ? "Finalizado" : "Listo para empezar"}
                                </span>
                            </div>
                        </div>

                        <div className="timer-actions">
                            <button className="timer-reset" type="button" onClick={resetTimer}>Reiniciar</button>

                            <button className="timer-start" type="button" onClick={handleClickIniciar}>
                                {isRunning ? "Pausar" : secondsLeft === 0 ? "Empezar de nuevo" : "Iniciar Pomodoro"}
                            </button>
                        </div>

                    </div>
                </section>
                <section className="pomodoro-layout task-section" aria-labelledby="selected-task-heading">
                    <div className="section-heading">
                        <span className="section-eyebrow">Enfoque actual</span>
                        <h2 id="selected-task-heading">Tarea en curso</h2>
                    </div>

                    {selectedTask ? (
                        <article className="selected-task-card">
                            <header className="selected-task-header">
                                <div>
                                    <span className="selected-task-label">Tarea seleccionada</span>
                                    <h3>{selectedTask.titulo}</h3>
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
                                            return (
                                                <li className={completado ? "task-step completed" : "task-step"} key={paso.id}>
                                                    <input
                                                        id={`pomodoro-paso-${paso.id}`}
                                                        type="checkbox"
                                                        checked={completado}
                                                        onChange={() => handleMarcarPasoCompletado(paso.id)}
                                                    />
                                                    <label htmlFor={`pomodoro-paso-${paso.id}`}>{paso.titulo}</label>
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
            </div>
        </main>
    );
}
