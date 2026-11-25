import { Outlet } from "react-router-dom";

import Footer from "@/shared/components/footer";
import Navbar from "@/shared/components/navbar";

export default function AppLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
