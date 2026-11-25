import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

import { CustomError } from "@/core/domain/errors/custom.error";

declare module "@tanstack/react-query" {
    interface Register {
        defaultError: CustomError;
    }
}

const normalizeError = (error: unknown): CustomError => {
    if (error instanceof CustomError) {
        return error;
    }

    if (error instanceof Error) {
        return CustomError.internalServer({ message: error.message });
    }

    return CustomError.internalServer({ message: "An unexpected error occurred" });
};

const handleGlobalError = (_error: CustomError): void => {
    // TODO: Manejar el error global (ej. notificaciones, toast, logging o redirección)
};

export const createQueryClient = (): QueryClient => {
    return new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: 1,
            },
        },
        queryCache: new QueryCache({
            onError: (error): void => {
                handleGlobalError(normalizeError(error));
            },
        }),
        mutationCache: new MutationCache({
            onError: (error): void => {
                handleGlobalError(normalizeError(error));
            },
        }),
    });
};
