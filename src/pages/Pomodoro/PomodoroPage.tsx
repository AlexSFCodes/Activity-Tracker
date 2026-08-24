import { useEffect, useMemo, useState } from "react";
import "./PomodoroPage.css";
import PomodoroStartModal from "../../Components/PomodoroStartModal/PomodoroStartModal"

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
    const [completedSessions, setCompletedSessions] = useState(0);

    // Renderizado del modal
    const [startModal, setStartModal] = useState(false);

    // Funcion para pomodoro
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

    function handleClickIniciar() {
        if (isRunning) {
            setIsRunning(false); // pausar
            return;
        }

        if (secondsLeft === DURATIONS[mode]) {
            setStartModal(true); // aún no ha empezado -> mostrar modal primero
            return;
        }

        setIsRunning(true); // ya había empezado antes, solo reanuda
    }

    function handleIniciarDesdeModal() {
        setIsRunning(true);
        setStartModal(false);
    }

    return (

        <main className="pomodoro-page">

            {/* El primer modal a cambiar */}
            {startModal && (
                <PomodoroStartModal
                    onClose={() => setStartModal(false)}
                    onIniciar={handleIniciarDesdeModal}
                />
            )}

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
                        <button className="timer-start" type="button" onClick={handleClickIniciar}>
                            {isRunning ? "Pausar" : secondsLeft === 0 ? "Empezar de nuevo" : "Iniciar Pomodoro"}
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}