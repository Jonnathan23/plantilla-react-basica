import CounterItemCard from "@/features/demo/ui/components/counter-item-card";
import { useCounterPage } from "@/features/demo/ui/hooks/logic/use-counter-page.hook";

export default function CounterPage() {
    const {
        label,
        initialValueText,
        counters,
        isLoading,
        isCreating,
        isBusy,
        activeError,
        handleLabelChange,
        handleInitialValueChange,
        handleCreateSubmit,
        handleUpdateCounter,
        handleDeleteCounter,
    } = useCounterPage();

    const renderCountersContent = () => {
        if (isLoading) {
            return (
                <p className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center text-sm text-slate-400">
                    Cargando contadores...
                </p>
            );
        }

        if (counters.length === 0) {
            return (
                <p className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center text-sm text-slate-400">
                    Aún no hay contadores guardados. Crea el primero arriba para probar la persistencia en localStorage.
                </p>
            );
        }

        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {counters.map((counter) => (
                    <CounterItemCard
                        key={counter.id}
                        counter={counter}
                        isBusy={isBusy}
                        onUpdate={handleUpdateCounter}
                        onDelete={handleDeleteCounter}
                    />
                ))}
            </div>
        );
    };

    return (
        <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 text-slate-100">
            <header className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
                <span className="inline-flex items-center rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 ring-1 ring-sky-500/30">
                    Demo CRUD • LocalStorage + DI + TanStack Query
                </span>
                <h1 className="mt-3 text-2xl font-bold tracking-tight text-white">Gestor de Contadores</h1>
                <p className="mt-1 text-sm text-slate-400">
                    Flujo completo desacoplado con Entidad, DTOs, Mapper inyectado, Repositorio, Servicio, DI y Custom Hooks.
                </p>

                <form onSubmit={handleCreateSubmit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-12">
                    <div className="flex flex-col gap-1.5 sm:col-span-6">
                        <label htmlFor="counter-label" className="text-xs font-medium text-slate-300">
                            Nombre del contador
                        </label>
                        <input
                            id="counter-label"
                            type="text"
                            value={label}
                            onChange={handleLabelChange}
                            placeholder="Ej. Visitas diarias"
                            className="rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 sm:col-span-3">
                        <label htmlFor="counter-initial-value" className="text-xs font-medium text-slate-300">
                            Valor inicial
                        </label>
                        <input
                            id="counter-initial-value"
                            type="number"
                            step={1}
                            value={initialValueText}
                            onChange={handleInitialValueChange}
                            className="rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex items-end sm:col-span-3">
                        <button
                            type="submit"
                            disabled={isBusy}
                            className="w-full cursor-pointer rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isCreating ? "Creando..." : "Crear"}
                        </button>
                    </div>
                </form>

                {activeError ? (
                    <p
                        role="alert"
                        className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300"
                    >
                        {activeError.message}
                    </p>
                ) : null}
            </header>

            {renderCountersContent()}
        </section>
    );
}
