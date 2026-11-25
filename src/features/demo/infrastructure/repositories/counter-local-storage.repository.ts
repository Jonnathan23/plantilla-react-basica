import { CustomError } from "@/core/domain/errors/custom.error";

import { CounterRepository } from "@/features/demo/domain/repositories/counter.repository";
import type { CounterStorageRecord } from "@/features/demo/infrastructure/mappers/counter.mapper";

const COUNTERS_STORAGE_KEY = "demo_counters_v1";

export class CounterLocalStorageRepository extends CounterRepository {
    public async readAllRaw(): Promise<unknown> {
        try {
            const rawContent = await Promise.resolve(window.localStorage.getItem(COUNTERS_STORAGE_KEY));

            if (rawContent === null) {
                return [];
            }

            return JSON.parse(rawContent);
        } catch {
            throw CustomError.internalServer({
                message: "No se pudieron leer los contadores desde el almacenamiento local.",
            });
        }
    }

    public async saveAllRaw(records: CounterStorageRecord[]): Promise<void> {
        try {
            const serializedRecords = JSON.stringify(records);

            await Promise.resolve(window.localStorage.setItem(COUNTERS_STORAGE_KEY, serializedRecords));
        } catch {
            throw CustomError.internalServer({
                message: "No se pudieron guardar los contadores en el almacenamiento local.",
            });
        }
    }
}
