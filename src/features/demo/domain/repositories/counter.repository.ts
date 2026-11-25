import type { CounterStorageRecord } from "@/features/demo/infrastructure/mappers/counter.mapper";

export abstract class CounterRepository {
    public abstract readAllRaw(): Promise<unknown>;
    public abstract saveAllRaw(records: CounterStorageRecord[]): Promise<void>;
}
