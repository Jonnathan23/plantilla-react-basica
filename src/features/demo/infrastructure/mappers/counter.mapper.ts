import { CustomError } from "@/core/domain/errors/custom.error";

import type { CounterEntity } from "@/features/demo/domain/entities/counter.entity";

export interface CounterStorageRecord {
    id: string;
    label: string;
    value: number;
    updated_at: string;
}

export abstract class CounterMapper {
    public abstract toEntity(raw: unknown): CounterEntity;
    public abstract toEntityList(raw: unknown): CounterEntity[];
    public abstract toStorageRecord(entity: CounterEntity): CounterStorageRecord;
    public abstract toStorageRecordList(entities: CounterEntity[]): CounterStorageRecord[];
}

export class CounterLocalStorageMapper extends CounterMapper {
    private isRecord(value: unknown): value is Record<string, unknown> {
        return typeof value === "object" && value !== null && !Array.isArray(value);
    }

    public toEntity(raw: unknown): CounterEntity {
        if (!this.isRecord(raw)) {
            throw CustomError.internalServer({
                message: "El registro almacenado del contador no tiene un formato válido.",
            });
        }

        const { id, label, value, updated_at: updatedAt } = raw;

        if (
            typeof id !== "string" ||
            typeof label !== "string" ||
            typeof value !== "number" ||
            Number.isNaN(value) ||
            typeof updatedAt !== "string"
        ) {
            throw CustomError.internalServer({
                message: "Los datos del contador en almacenamiento están corruptos.",
            });
        }

        return {
            id,
            label,
            value,
            updatedAt,
        };
    }

    public toEntityList(raw: unknown): CounterEntity[] {
        if (!Array.isArray(raw)) {
            throw CustomError.internalServer({
                message: "La lista de contadores almacenada no es válida.",
            });
        }

        return raw.map((item) => this.toEntity(item));
    }

    public toStorageRecord(entity: CounterEntity): CounterStorageRecord {
        return {
            id: entity.id,
            label: entity.label,
            value: entity.value,
            updated_at: entity.updatedAt,
        };
    }

    public toStorageRecordList(entities: CounterEntity[]): CounterStorageRecord[] {
        return entities.map((entity) => this.toStorageRecord(entity));
    }
}
