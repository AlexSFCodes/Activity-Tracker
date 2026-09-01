export type PomodoroMode = "focus" | "shortBreak" | "longBreak";

export const DURATIONS: Record<PomodoroMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const MODE_LABELS: Record<PomodoroMode, string> = {
  focus: "Pomodoro",
  shortBreak: "Descanso corto",
  longBreak: "Descanso largo",
};
