import type { CreateCounterDto } from "@/features/demo/domain/dtos/create-counter.dto";
import type { UpdateCounterDto } from "@/features/demo/domain/dtos/update-counter.dto";
import type { CounterEntity } from "@/features/demo/domain/entities/counter.entity";

export abstract class CounterService {
    public abstract getCounters(): Promise<CounterEntity[]>;
    public abstract createCounter(dto: CreateCounterDto): Promise<CounterEntity>;
    public abstract updateCounter(dto: UpdateCounterDto): Promise<CounterEntity>;
    public abstract deleteCounter(id: string): Promise<void>;
}
