import { useEffect, useMemo, useState } from "react";
import type { Sesion, Tarea } from "../../types";
import { calculateStats, formatMinutes } from "./progreso.utils";
import "./ProgresoPage.css";

const dateLabel = (date: Date) => date.toLocaleDateString("es", { day: "numeric", month: "short" });

export default function ProgresoPage() {
    const [data, setData] = useState<{ tareas: Tarea[]; sesiones: Sesion[] } | null>(null);
    const [period, setPeriod] = useState(7);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [revision, setRevision] = useState(0);
    const [visible, setVisible] = useState(10);
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError("");
        async function load() {
            try {
                const result = await window.api.obtenerEstadisticas();
                if (!cancelled) setData(result);
            } catch {
                if (!cancelled) setError("No se pudieron cargar las estadísticas. Comprueba que estás usando la app de escritorio y vuelve a intentarlo.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        void load();
        return () => { cancelled = true; };
    }, [revision]);
    const stats = useMemo(() => data ? calculateStats(data.tareas, data.sesiones, period) : null, [data, period]);
    const maxMinutes = Math.max(1, ...(stats?.days.map(d => d.minutes) ?? []));
    const taskNames = new Map(data?.tareas.map(t => [t.id, t.titulo]));
    return (
        <main className="progreso-page">
            <div className="progreso-container">
                <header className="progreso-header">
                    <div><h1>Progreso y estadísticas</h1><p>Cada sesión cuenta. Descubre cómo avanzas.</p></div>
                    <button type="button" className="progreso-button" disabled={loading} onClick={() => setRevision(r => r + 1)}>Actualizar</button>
                </header>
                <div className="progreso-toolbar">
                    <div className="progreso-period" role="group" aria-label="Período de las sesiones">
                        {[7, 30].map(days => <button type="button" key={days} aria-pressed={period === days} onClick={() => { setPeriod(days); setVisible(10); }}>Últimos {days} días</button>)}
                    </div>
                    {stats && <span>{dateLabel(stats.days[0]!.date)} — {dateLabel(stats.days[stats.days.length - 1]!.date)}</span>}
                </div>
                {loading && <p role="status">Cargando estadísticas…</p>}
                {error && <div className="progreso-error" role="alert">{error} <button type="button" className="progreso-button" onClick={() => setRevision(r => r + 1)}>Reintentar</button></div>}
                {!loading && !error && stats && data && <>
                    <ul className="progreso-summary">
                        <li className="progreso-stat"><span>Racha actual</span><strong>{stats.streak} {stats.streak === 1 ? "día" : "días"}</strong><small>Días seguidos con enfoque hasta hoy o ayer</small></li>
                        <li className="progreso-stat"><span>Tareas totales</span><strong>{data.tareas.length}</strong><small>{stats.completed} completadas · {data.tareas.length - stats.completed} pendientes, en total</small></li>
                        <li className="progreso-stat"><span>Sesiones registradas</span><strong>{stats.filtered.length}</strong><small>{stats.activeDays} días activos en el período</small></li>
                        <li className="progreso-stat"><span>Tiempo de enfoque</span><strong>{formatMinutes(stats.totalMinutes)}</strong><small>{formatMinutes(stats.totalMinutes / period)} al día en promedio</small></li>
                    </ul>
                    <div className="progreso-details">
                        <section className="progreso-panel" aria-labelledby="tiempo-por-dia">
                            <h2 id="tiempo-por-dia">Tiempo por día</h2>
                            <p className="progreso-caption">Minutos de enfoque · fechas locales de inicio de sesión</p>
                            {stats.filtered.length === 0 ? <p className="progreso-empty">No hay sesiones en este período. Completa un Pomodoro asociado a una tarea para registrar tu enfoque.</p> : <div className="progreso-chart-scroll">
                                <div className="progreso-chart" style={{ minWidth: period === 30 ? 900 : 280 }}>
                                    {stats.days.map(day => <div className="progreso-day" key={day.key}>
                                        <div className="progreso-bar-track"><div className="progreso-bar" style={{ height: `${day.minutes / maxMinutes * 100}%` }} /></div>
                                        <span>{dateLabel(day.date)}</span><strong>{formatMinutes(day.minutes)}</strong>
                                    </div>)}
                                </div>
                            </div>}
                        </section>
                        <section className="progreso-panel" aria-labelledby="distribucion-tiempo">
                            <h2 id="distribucion-tiempo">Distribución de tiempo</h2>
                            <p className="progreso-caption">Enfoque por tarea en el período seleccionado</p>
                            {stats.distribution.length === 0 ? <p className="progreso-empty">Aquí verás a qué tareas dedicas tu tiempo.</p> : <ul className="progreso-distribution">
                                {stats.distribution.map(task => <li key={task.id}>
                                    <div><span>{task.titulo}</span><strong>{formatMinutes(task.minutes)} · {Math.round(task.minutes / stats.totalMinutes * 100)}%</strong></div>
                                    <meter min={0} max={stats.totalMinutes} value={task.minutes} aria-label={`Tiempo dedicado a ${task.titulo}`} />
                                </li>)}
                            </ul>}
                        </section>
                    </div>
                    <section className="progreso-panel progreso-history" aria-labelledby="historial-sesiones">
                        <h2 id="historial-sesiones">Historial de sesiones</h2>
                        <p className="progreso-caption">Solo incluye sesiones con tiempo guardado. Al borrar una tarea también se elimina su historial.</p>
                        {stats.filtered.length === 0 ? <p className="progreso-empty">Todavía no hay sesiones para mostrar en estas fechas.</p> : <>
                            <div className="progreso-table-scroll"><table>
                                <thead><tr><th scope="col">Tarea</th><th scope="col">Fecha de inicio</th><th scope="col">Enfoque</th><th scope="col">Descripción</th></tr></thead>
                                <tbody>{stats.filtered.slice(0, visible).map(session => <tr key={session.id}>
                                    <td>{taskNames.get(session.tarea_id) ?? "Tarea no disponible"}</td>
                                    <td>{new Date(session.fecha).toLocaleString("es", { dateStyle: "medium", timeStyle: "short" })}</td>
                                    <td>{formatMinutes(session.tiempo)}</td><td>{session.logro || "Sin descripción"}</td>
                                </tr>)}</tbody>
                            </table></div>
                            {visible < stats.filtered.length && <button type="button" className="progreso-button progreso-more" onClick={() => setVisible(n => n + 10)}>Mostrar más sesiones ({stats.filtered.length - visible} restantes)</button>}
                        </>}
                    </section>
                </>}
            </div>
        </main>
    );
}
