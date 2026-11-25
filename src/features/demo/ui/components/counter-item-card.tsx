import type { UpdateCounterDto } from "@/features/demo/domain/dtos/update-counter.dto";
import type { CounterEntity } from "@/features/demo/domain/entities/counter.entity";
import { COUNTER_OPERATION } from "@/features/demo/domain/enums/counter-operation.enum";

interface CounterItemCardProps {
    readonly counter: CounterEntity;
    readonly isBusy: boolean;
    readonly onUpdate: (dto: UpdateCounterDto) => void;
    readonly onDelete: (id: string) => void;
}

export default function CounterItemCard({ counter, isBusy, onUpdate, onDelete }: CounterItemCardProps) {
    const handleDecrement = () => {
        onUpdate({ id: counter.id, operation: COUNTER_OPERATION.DECREMENT });
    };

    const handleIncrement = () => {
        onUpdate({ id: counter.id, operation: COUNTER_OPERATION.INCREMENT });
    };

    const handleReset = () => {
        onUpdate({ id: counter.id, operation: COUNTER_OPERATION.RESET });
    };

    const handleDelete = () => {
        onDelete(counter.id);
    };

    return (
        <article className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-white">{counter.label}</h2>
                    <p className="mt-0.5 text-xs text-slate-400">
                        Actualizado: {new Date(counter.updatedAt).toLocaleTimeString()}
                    </p>
                </div>
                <span className="rounded-lg bg-slate-950 px-3 py-1 text-2xl font-bold tabular-nums text-sky-400 ring-1 ring-slate-800">
                    {counter.value}
                </span>
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    disabled={isBusy}
                    onClick={handleDecrement}
                    aria-label={`Decrementar ${counter.label}`}
                    className="flex-1 cursor-pointer rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    -1
                </button>
                <button
                    type="button"
                    disabled={isBusy}
                    onClick={handleIncrement}
                    aria-label={`Incrementar ${counter.label}`}
                    className="flex-1 cursor-pointer rounded-lg bg-sky-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    +1
                </button>
                <button
                    type="button"
                    disabled={isBusy}
                    onClick={handleReset}
                    aria-label={`Reiniciar ${counter.label}`}
                    className="cursor-pointer rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Reiniciar
                </button>
                <button
                    type="button"
                    disabled={isBusy}
                    onClick={handleDelete}
                    aria-label={`Eliminar ${counter.label}`}
                    className="cursor-pointer rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Eliminar
                </button>
            </div>
        </article>
    );
}
