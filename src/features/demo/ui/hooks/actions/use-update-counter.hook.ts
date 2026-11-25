import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CustomError } from "@/core/domain/errors/custom.error";

import type { MutationResult } from "@/core/presentation/interfaces/tan-stack.interface";

import { UpdateCounterService } from "@/features/demo/di/counter.dependency";
import type { UpdateCounterDto } from "@/features/demo/domain/dtos/update-counter.dto";
import type { CounterEntity } from "@/features/demo/domain/entities/counter.entity";
import { COUNTERS_QUERY_KEY } from "@/features/demo/ui/hooks/actions/use-get-counters.hook";

export const useUpdateCounter = (): MutationResult<CounterEntity, CustomError, UpdateCounterDto> => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: UpdateCounterService,
        onSuccess: (): void => {
            void queryClient.invalidateQueries({ queryKey: COUNTERS_QUERY_KEY });
        },
    });

    return {
        executeMutation: mutation.mutate,
        isPending: mutation.isPending,
        hasError: mutation.isError,
        errorDetails: mutation.error,
        isSuccessful: mutation.isSuccess,
    };
};
