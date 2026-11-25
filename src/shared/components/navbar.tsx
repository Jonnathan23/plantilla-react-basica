import { NavLink } from "react-router-dom";

interface NavItem {
    readonly label: string;
    readonly to: string;
    readonly isEnd?: boolean;
}

const NAV_ITEMS: readonly NavItem[] = [
    { label: "Inicio", to: "/", isEnd: true },
    { label: "Contador", to: "/counter" },
];

const getNavLinkClassName = ({ isActive }: { isActive: boolean }): string => {
    const baseClasses = "rounded-lg px-3.5 py-2 text-sm font-medium transition";
    const stateClasses = isActive
        ? "bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30"
        : "text-slate-300 hover:bg-slate-800 hover:text-white";

    return `${baseClasses} ${stateClasses}`;
};

export default function Navbar() {
    return (
        <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/90 backdrop-blur">
            <nav
                aria-label="Navegación principal"
                className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3"
            >
                <span className="text-base font-bold tracking-tight text-white">Plantilla React</span>

                <ul className="flex items-center gap-2">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.to}>
                            <NavLink to={item.to} end={item.isEnd} className={getNavLinkClassName}>
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}
