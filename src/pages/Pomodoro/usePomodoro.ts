import { useEffect, useMemo, useState } from "react";
import { DURATIONS, type PomodoroMode } from "./pomodoro.constants";

export function usePomodoro() {
  const [mode, setMode] = useState<PomodoroMode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((currentSeconds) => {
        if (currentSeconds > 1) return currentSeconds - 1;

        window.clearInterval(timer);
        setIsRunning(false);
        if (mode === "focus") {
          setCompletedSessions((sessions) => sessions + 1);
        }
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

  return {
    mode,
    secondsLeft,
    isRunning,
    completedSessions,
    progress,
    isAtStart: secondsLeft === DURATIONS[mode],
    changeMode,
    resetTimer,
    startTimer: () => setIsRunning(true),
    pauseTimer: () => setIsRunning(false),
  };
}
