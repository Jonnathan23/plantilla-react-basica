import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppLayout from "@/core/presentation/layouts/app.layout";

import DefaultPage from "@/shared/pages/default.page";

import CounterPage from "@/features/demo/ui/pages/counter.page";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<DefaultPage />} />
                    <Route path="/counter" element={<CounterPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
