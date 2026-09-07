import type { Sesion, Tarea } from "../../types";

export function dayKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
export function formatMinutes(minutes: number): string {
    if (minutes > 0 && minutes < 1) return "< 1 min";
    const rounded = Math.round(minutes);
    return rounded < 60 ? `${rounded} min` : `${Math.floor(rounded / 60)} h ${rounded % 60} min`;
}
export function calculateStats(tareas: Tarea[], sesiones: Sesion[], period: number, now = new Date()) {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const start = new Date(today);
    start.setDate(start.getDate() - period + 1);
    const valid = sesiones.filter(s => Number.isFinite(s.tiempo) && s.tiempo > 0 && Number.isFinite(Date.parse(s.fecha)) && new Date(s.fecha) <= now);
    const filtered = valid.filter(s => new Date(s.fecha) >= start).sort((a, b) => Date.parse(b.fecha) - Date.parse(a.fecha) || b.id - a.id);
    const activeDays = new Set(valid.map(s => dayKey(new Date(s.fecha))));
    const cursor = new Date(today);
    if (!activeDays.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    let streak = 0;
    while (activeDays.has(dayKey(cursor))) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
    }
    const days = Array.from({ length: period }, (_, index) => {
        const date = new Date(start);
        date.setDate(date.getDate() + index);
        return { date, key: dayKey(date), minutes: 0 };
    });
    const byDay = new Map(days.map(day => [day.key, day]));
    const byTask = new Map<number, number>();
    for (const session of filtered) {
        const day = byDay.get(dayKey(new Date(session.fecha)));
        if (day) day.minutes += session.tiempo;
        byTask.set(session.tarea_id, (byTask.get(session.tarea_id) ?? 0) + session.tiempo);
    }
    const totalMinutes = filtered.reduce((sum, s) => sum + s.tiempo, 0);
    const distribution = tareas.filter(t => byTask.has(t.id)).map(t => ({ ...t, minutes: byTask.get(t.id)! })).sort((a, b) => b.minutes - a.minutes || a.id - b.id);
    return { filtered, days, streak, totalMinutes, distribution, completed: tareas.filter(t => t.progreso >= 100).length, activeDays: days.filter(d => d.minutes > 0).length };
}
