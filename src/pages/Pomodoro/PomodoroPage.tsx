import { useEffect, useMemo, useState } from "react";
import "./PomodoroPage.css";

type PomodoroMode = "focus" | "shortBreak" | "longBreak";

const DURATIONS: Record<PomodoroMode, number> = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
};

const MODE_LABELS: Record<PomodoroMode, string> = {
    focus: "Pomodoro",
    shortBreak: "Descanso corto",
    longBreak: "Descanso largo",
};

function formatTime(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function PomodoroPage() {
    const [mode, setMode] = useState<PomodoroMode>("focus");
    const [secondsLeft, setSecondsLeft] = useState(DURATIONS.focus);
    const [isRunning, setIsRunning] = useState(false);
    const [taskName, setTaskName] = useState("");
    const [completedSessions, setCompletedSessions] = useState(0);

    useEffect(() => {
        if (!isRunning) return;

        const timer = window.setInterval(() => {
            setSecondsLeft((currentSeconds) => {
                if (currentSeconds > 1) return currentSeconds - 1;
                window.clearInterval(timer);
                setIsRunning(false);
                if (mode === "focus") setCompletedSessions((sessions) => sessions + 1);
                return 0;
            });
        }, 1000);

        return () => window.clearInterval(timer);
    }, [isRunning, mode]);

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

    return (
        <main className="pomodoro-page">
            <header className="pomodoro-header">
                <div className="pomodoro-eye">
                    <h1>Pomodoro</h1>
                    <p>Trabaja con intención, descansa y mantén el ritmo.</p>
                </div>
                <div className="session-counter" aria-label={`${completedSessions} sesiones completadas`}>
                    <span className="session-counter-number">{completedSessions}</span>
                    <span>sesiones<br />completadas</span>
                </div>
            </header>

            <section className="pomodoro-layout" aria-label="Temporizador Pomodoro">
                <div className="timer-card">
                    <div className="mode-tabs" role="tablist" aria-label="Modo del temporizador">
                        {(Object.keys(MODE_LABELS) as PomodoroMode[]).map((item) => (
                            <button
                                key={item}
                                className={mode === item ? "mode-tab active" : "mode-tab"}
                                type="button"
                                role="tab"
                                aria-selected={mode === item}
                                onClick={() => changeMode(item)}
                            >
                                {MODE_LABELS[item]}
                            </button>
                        ))}
                    </div>

                    <div className="pomodoro-timer" style={{ "--progress": `${progress}%` } as React.CSSProperties}>
                        <div className="timer-inner">
                            <span className="timer-label">{MODE_LABELS[mode]}</span>
                            <time className="timer-time" dateTime={`PT${secondsLeft}S`}>{formatTime(secondsLeft)}</time>
                            <span className="timer-status">
                                {isRunning ? "En curso" : secondsLeft === 0 ? "Finalizado" : "Listo para empezar"}
                            </span>
                        </div>
                    </div>

                    <div className="timer-actions">
                        <button className="timer-reset" type="button" onClick={resetTimer}>Reiniciar</button>
                        <button className="timer-start" type="button" onClick={() => setIsRunning((running) => !running)}>
                            {isRunning ? "Pausar" : secondsLeft === 0 ? "Empezar de nuevo" : "Iniciar Pomodoro"}
                        </button>
                    </div>
                </div>

                <aside className="pomodoro-side-panel">
                    <section className="active-task-card" aria-labelledby="active-task-title">
                        <div className="card-heading">
                            <span className="card-icon" aria-hidden="true">✓</span>
                            <h2 id="active-task-title">Tarea actual</h2>
                        </div>
                        <label htmlFor="pomodoro-task">¿En qué vas a trabajar?</label>
                        <input id="pomodoro-task" type="text" value={taskName} onChange={(event) => setTaskName(event.target.value)} placeholder="Escribe el nombre de la tarea" />
                        <p>{taskName.trim() || "Añade una tarea para mantener el enfoque."}</p>
                    </section>

                    <section className="tips-card" aria-labelledby="tips-title">
                        <h2 id="tips-title">Tu ritmo de hoy</h2>
                        <div className="session-dots" aria-label={`${completedSessions} de 4 sesiones`}>
                            {[0, 1, 2, 3].map((session) => (
                                <span key={session} className={session < completedSessions ? "session-dot done" : "session-dot"} />
                            ))}
                        </div>
                        <p>Completa 4 pomodoros y toma un descanso largo.</p>
                    </section>
                </aside>
            </section>
        </main>
    );
}
