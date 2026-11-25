import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";

import { CustomError } from "@/core/domain/errors/custom.error";

import { createQueryClient } from "@/core/presentation/config/query-client.config";
import Router from "@/core/presentation/routers/router";

import "@/index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw CustomError.internalServer({ message: "No se encontró el elemento #root en el DOM." });
}

const queryClient = createQueryClient();

createRoot(rootElement).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <Router />
        </QueryClientProvider>
    </StrictMode>,
);
