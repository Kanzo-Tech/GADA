'use client';
import { Logo } from "./logo";
import { navigation } from "./redirecting";

export function Sidebar() {
    const { navigateTo } = navigation();

    return (
        <aside className="flex flex-col border border-slate-900 h-screen w-56 shrink-0 bg-[#ededed]">
            <div className="p-4 border-b border-slate-900 flex items-center gap-2">
                <Logo />
            </div>

            {/* NAVEGACIÓN */}
            <nav className="flex-1 p-4 border-b flex flex-col gap-3">
                <button
                    className="text-left px-2 py-1 hover:bg-gray-300 rounded"
                    onClick={() => { navigateTo('/context-form') }}
                >
                    Context
                </button>
                <button
                    className="text-left px-2 py-1 hover:bg-gray-300 rounded"
                    onClick={() => { navigateTo('/export') }}>
                    Export
                </button>
                <button
                    className="text-left px-2 py-1 hover:bg-gray-300 rounded"
                    onClick={() => { navigateTo('/summary') }}
                >
                    Documents generated
                </button>
            </nav>

            {/* FOOTER: SETTINGS + HELP */}
            <div className="p-4 flex flex-col gap-3">
                <button className="text-left px-2 py-1 hover:bg-gray-300 rounded">
                    ⚙ Configuración (WIP)
                </button>
                <button className="text-left px-2 py-1 hover:bg-gray-300 rounded">
                    ❓ Ayuda / About (WIP)
                </button>
            </div>
        </aside>
    );
}


export default Sidebar;