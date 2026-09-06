import "./ProgresoPage.css";

export default function ProgresoPage() {
    return (
        <main className="progreso-page">
            <div className="progreso-container">
                <header className="progreso-header">
                    <h1>Progreso y estadísticas</h1>
                </header>

                <ul className="progreso-summary">
                    <li className="progreso-stat">Racha actual</li>
                    <li className="progreso-stat">Tareas totales</li>
                    <li className="progreso-stat">Sesiones</li>
                    <li className="progreso-stat">Tiempo de enfoque</li>
                </ul>

                <div className="progreso-details">
                    <section className="progreso-panel" aria-labelledby="tiempo-por-dia">
                        <h2 id="tiempo-por-dia">Tiempo por día</h2>
                    </section>
                    <section className="progreso-panel" aria-labelledby="distribucion-tiempo">
                        <h2 id="distribucion-tiempo">Distribución de tiempo</h2>
                    </section>
                </div>
            </div>
        </main>
    );
}
