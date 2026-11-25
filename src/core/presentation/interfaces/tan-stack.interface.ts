import type { QueryObserverResult, RefetchOptions, UseMutateFunction } from "@tanstack/react-query";

import type { CustomError } from "@/core/domain/errors/custom.error";

export interface MutationResult<TData, TError = CustomError, TVariables = void> {
    executeMutation: UseMutateFunction<TData, TError, TVariables, unknown>;
    isPending: boolean;
    hasError: boolean;
    errorDetails: TError | null;
    isSuccessful: boolean;
}

export interface QueryResult<TData, TError = CustomError> {
    data: TData | undefined;
    isLoading: boolean;
    isFetching: boolean;
    hasError: boolean;
    errorDetails: TError | null;
    isSuccessful: boolean;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<TData, TError>>;
}
