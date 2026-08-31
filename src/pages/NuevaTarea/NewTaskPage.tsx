import { useState } from "react";
import "./NewTaskPage.css";

export default function NewTaskPage() {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //crear los pasos
    const [pasos, setPasos] = useState<number[]>([]);
    function agregarPaso() {
        setPasos([...pasos, Date.now()]);
    }
    function eliminarPaso(id: number) {
        setPasos(pasos.filter(p => p !== id));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // evita que el form recargue la página

        if (!titulo.trim()) {
            setError("El título es obligatorio");
            return;
        }

        setError(null);
        setEnviando(true);

        try {
            const nuevaTarea = await window.api.crearTarea(titulo, descripcion);
            console.log("Tarea creada con id:", nuevaTarea.id);

            // limpiamos el formulario
            setTitulo("");
            setDescripcion("");
        } catch (err) {
            console.error("Error al crear la tarea:", err);
            setError("No se pudo guardar la tarea");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <main className="new-task-page">
            <header className="page-header">
                <h1>Nueva tarea</h1>
                <p>
                    Define tu próximo objetivo. Utiliza la IA para desglosarlo
                    en pasos concretos.
                </p>
            </header>

            <section className="form-container" aria-labelledby="form-title">
                <h2 id="form-title" className="sr-only">
                    Crear nueva tarea
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="titulo">
                            Título de la tarea
                        </label>

                        <input
                            className="form-input"
                            type="text"
                            id="titulo"
                            name="titulo"
                            placeholder="¿Qué quieres lograr?"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}

                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="descripcion">
                            Descripción y contexto
                        </label>

                        <textarea
                            className="form-input form-textarea"
                            id="descripcion"
                            name="descripcion"
                            placeholder="Añade detalles o el propósito de la tarea"
                            rows={4}
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="pasos">Pasos sugeridos</label>
                        <div id="pasos" className="pasos-container">
                            {pasos.map((p) => (
                                <div key={p} className="paso-item">
                                    <input className="form-input paso-input" type="text" placeholder="Ej: Investigar sobre el tema" />
                                    <button type="button" className="btn-eliminar-paso" onClick={() => eliminarPaso(p)} title="Eliminar paso">
                                        &times;
                                    </button>
                                </div>
                            ))}
                            <button className="btn btn-paso" type="button" onClick={agregarPaso}>
                                + Agregar paso
                            </button>
                        </div>
                    </div>

                    {error && <p className="form-error">  {error}</p>}

                    <div className="form-actions">
                        <button
                            className="btn btn-primary"
                            type="button"
                        >
                            Ayúdame con IA
                        </button>

                        <button
                            className="btn btn-success"
                            type="submit"
                            disabled={enviando}
                        >
                            {enviando ? "Guardando..." : "Crear tarea"}
                        </button>
                    </div>
                </form>
            </section>

            <section
                className="plan-sugerido"
                aria-labelledby="plan-title"
            >
                <h2 id="plan-title">
                    Plan sugerido
                </h2>

                <div id="plan-ia" className="plan-content">
                    <p>
                        Haz clic en "Ayúdame con IA" para obtener sugerencias.
                    </p>
                </div>
            </section>
        </main>
    );
}