import type { CounterOperation } from "@/features/demo/domain/enums/counter-operation.enum";

export interface UpdateCounterDto {
    id: string;
    operation: CounterOperation;
}
