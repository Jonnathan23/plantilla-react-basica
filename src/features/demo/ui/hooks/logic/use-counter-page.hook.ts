import { type ChangeEvent, type FormEvent, useState } from "react";

import type { CustomError } from "@/core/domain/errors/custom.error";

import type { UpdateCounterDto } from "@/features/demo/domain/dtos/update-counter.dto";
import type { CounterEntity } from "@/features/demo/domain/entities/counter.entity";
import { useCreateCounter } from "@/features/demo/ui/hooks/actions/use-create-counter.hook";
import { useDeleteCounter } from "@/features/demo/ui/hooks/actions/use-delete-counter.hook";
import { useGetCounters } from "@/features/demo/ui/hooks/actions/use-get-counters.hook";
import { useUpdateCounter } from "@/features/demo/ui/hooks/actions/use-update-counter.hook";

const DEFAULT_INITIAL_VALUE = "0";

export interface UseCounterPageResult {
    label: string;
    initialValueText: string;
    counters: CounterEntity[];
    isLoading: boolean;
    isCreating: boolean;
    isBusy: boolean;
    activeError: CustomError | null;
    handleLabelChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleInitialValueChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleCreateSubmit: (event: FormEvent<HTMLFormElement>) => void;
    handleUpdateCounter: (dto: UpdateCounterDto) => void;
    handleDeleteCounter: (id: string) => void;
}

export const useCounterPage = (): UseCounterPageResult => {
    const [label, setLabel] = useState("");
    const [initialValueText, setInitialValueText] = useState(DEFAULT_INITIAL_VALUE);

    const countersQuery = useGetCounters();
    const createCounter = useCreateCounter();
    const updateCounter = useUpdateCounter();
    const deleteCounter = useDeleteCounter();

    const counters = countersQuery.data ?? [];
    const isBusy = createCounter.isPending || updateCounter.isPending || deleteCounter.isPending;
    const activeError =
        createCounter.errorDetails ?? updateCounter.errorDetails ?? deleteCounter.errorDetails ?? countersQuery.errorDetails;

    const handleLabelChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLabel(event.target.value);
    };

    const handleInitialValueChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setInitialValueText(event.target.value);
    };

    const handleCreateSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        const parsedInitialValue = initialValueText.trim() === "" ? 0 : Number(initialValueText);

        createCounter.executeMutation(
            {
                label,
                initialValue: parsedInitialValue,
            },
            {
                onSuccess: (): void => {
                    setLabel("");
                    setInitialValueText(DEFAULT_INITIAL_VALUE);
                },
            },
        );
    };

    const handleUpdateCounter = (dto: UpdateCounterDto): void => {
        updateCounter.executeMutation(dto);
    };

    const handleDeleteCounter = (id: string): void => {
        deleteCounter.executeMutation(id);
    };

    return {
        label,
        initialValueText,
        counters,
        isLoading: countersQuery.isLoading,
        isCreating: createCounter.isPending,
        isBusy,
        activeError,
        handleLabelChange,
        handleInitialValueChange,
        handleCreateSubmit,
        handleUpdateCounter,
        handleDeleteCounter,
    };
};
