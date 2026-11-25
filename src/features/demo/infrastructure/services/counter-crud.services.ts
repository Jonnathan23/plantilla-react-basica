import { CustomError } from "@/core/domain/errors/custom.error";

import type { CreateCounterDto } from "@/features/demo/domain/dtos/create-counter.dto";
import type { UpdateCounterDto } from "@/features/demo/domain/dtos/update-counter.dto";
import type { CounterEntity } from "@/features/demo/domain/entities/counter.entity";
import { COUNTER_OPERATION, type CounterOperation } from "@/features/demo/domain/enums/counter-operation.enum";
import type { CounterRepository } from "@/features/demo/domain/repositories/counter.repository";
import { CounterService } from "@/features/demo/domain/services/counter.services";
import type { CounterMapper } from "@/features/demo/infrastructure/mappers/counter.mapper";

const MAX_LABEL_LENGTH = 40;
const RESET_VALUE = 0;
const STEP_VALUE = 1;

export class CounterCrudService extends CounterService {
    private readonly repository: CounterRepository;
    private readonly mapper: CounterMapper;

    public constructor(repository: CounterRepository, mapper: CounterMapper) {
        super();
        this.repository = repository;
        this.mapper = mapper;
    }

    public async getCounters(): Promise<CounterEntity[]> {
        const rawRecords = await this.repository.readAllRaw();

        return this.mapper.toEntityList(rawRecords);
    }

    public async createCounter(dto: CreateCounterDto): Promise<CounterEntity> {
        const normalizedLabel = dto.label.trim();

        this.validateLabel(normalizedLabel);
        this.validateInitialValue(dto.initialValue);

        const counters = await this.getCounters();
        this.validateUniqueLabel(counters, normalizedLabel);

        const newCounter = this.buildNewCounter(normalizedLabel, dto.initialValue);
        const updatedCounters = [newCounter, ...counters];

        await this.persistCounters(updatedCounters);

        return newCounter;
    }

    public async updateCounter(dto: UpdateCounterDto): Promise<CounterEntity> {
        const counters = await this.getCounters();
        const existingCounter = this.findCounterOrThrow(counters, dto.id);
        const nextValue = this.calculateNextValue(existingCounter.value, dto.operation);

        const updatedCounter: CounterEntity = {
            ...existingCounter,
            value: nextValue,
            updatedAt: new Date().toISOString(),
        };

        const updatedCounters = counters.map((counter) => (counter.id === dto.id ? updatedCounter : counter));

        await this.persistCounters(updatedCounters);

        return updatedCounter;
    }

    public async deleteCounter(id: string): Promise<void> {
        const counters = await this.getCounters();
        this.findCounterOrThrow(counters, id);

        const remainingCounters = counters.filter((counter) => counter.id !== id);

        await this.persistCounters(remainingCounters);
    }

    private validateLabel(label: string): void {
        if (label.length === 0) {
            throw CustomError.badRequest({
                message: "El nombre del contador es obligatorio.",
                field: "label",
            });
        }

        if (label.length > MAX_LABEL_LENGTH) {
            throw CustomError.badRequest({
                message: `El nombre no puede superar los ${MAX_LABEL_LENGTH} caracteres.`,
                field: "label",
            });
        }
    }

    private validateInitialValue(initialValue: number): void {
        if (!Number.isFinite(initialValue) || !Number.isInteger(initialValue)) {
            throw CustomError.badRequest({
                message: "El valor inicial debe ser un número entero válido.",
                field: "initialValue",
            });
        }
    }

    private validateUniqueLabel(counters: CounterEntity[], label: string): void {
        const normalizedTarget = label.toLowerCase();
        const hasDuplicate = counters.some((counter) => counter.label.toLowerCase() === normalizedTarget);

        if (hasDuplicate) {
            throw CustomError.conflict({
                message: `Ya existe un contador con el nombre "${label}".`,
                field: "label",
            });
        }
    }

    private findCounterOrThrow(counters: CounterEntity[], id: string): CounterEntity {
        const foundCounter = counters.find((counter) => counter.id === id);

        if (!foundCounter) {
            throw CustomError.notFound({
                message: "El contador solicitado no existe.",
            });
        }

        return foundCounter;
    }

    private calculateNextValue(currentValue: number, operation: CounterOperation): number {
        switch (operation) {
            case COUNTER_OPERATION.INCREMENT: {
                return currentValue + STEP_VALUE;
            }
            case COUNTER_OPERATION.DECREMENT: {
                return currentValue - STEP_VALUE;
            }
            case COUNTER_OPERATION.RESET: {
                return RESET_VALUE;
            }
        }
    }

    private buildNewCounter(label: string, initialValue: number): CounterEntity {
        return {
            id: crypto.randomUUID(),
            label,
            value: initialValue,
            updatedAt: new Date().toISOString(),
        };
    }

    private async persistCounters(counters: CounterEntity[]): Promise<void> {
        const storageRecords = this.mapper.toStorageRecordList(counters);

        await this.repository.saveAllRaw(storageRecords);
    }
}
