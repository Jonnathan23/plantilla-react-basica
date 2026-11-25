import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CustomError } from "@/core/domain/errors/custom.error";

import type { MutationResult } from "@/core/presentation/interfaces/tan-stack.interface";

import { DeleteCounterService } from "@/features/demo/di/counter.dependency";
import { COUNTERS_QUERY_KEY } from "@/features/demo/ui/hooks/actions/use-get-counters.hook";

export const useDeleteCounter = (): MutationResult<void, CustomError, string> => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: DeleteCounterService,
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
