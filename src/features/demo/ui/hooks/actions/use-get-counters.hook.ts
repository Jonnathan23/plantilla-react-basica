import { useQuery } from "@tanstack/react-query";

import type { CustomError } from "@/core/domain/errors/custom.error";

import type { QueryResult } from "@/core/presentation/interfaces/tan-stack.interface";

import { GetCountersService } from "@/features/demo/di/counter.dependency";
import type { CounterEntity } from "@/features/demo/domain/entities/counter.entity";

export const COUNTERS_QUERY_KEY = ["demo-counters"] as const;

export const useGetCounters = (): QueryResult<CounterEntity[], CustomError> => {
    const countersQuery = useQuery({
        queryKey: COUNTERS_QUERY_KEY,
        queryFn: GetCountersService,
    });

    return {
        data: countersQuery.data,
        isLoading: countersQuery.isLoading,
        isFetching: countersQuery.isFetching,
        hasError: countersQuery.isError,
        errorDetails: countersQuery.error,
        isSuccessful: countersQuery.isSuccess,
        refetch: countersQuery.refetch,
    };
};
