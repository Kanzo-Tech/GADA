'use client';
import { useRouter } from "@/i18n/navigation";
import { Logo } from "./logo";
import { useTranslations } from "next-intl";


export function Sidebar() {
    const router = useRouter();
    const t = useTranslations("sidebar");

    return (
        <aside className="flex flex-col border border-slate-900 h-screen w-56 shrink-0 bg-[#ededed]">
            <div className="p-4 border-b border-slate-900 flex items-center gap-2">
                <Logo />
            </div>

            {/* NAVEGACIÓN */}
            <nav className="flex-1 p-4 border-b flex flex-col gap-3">
                <button
                    className="text-left px-2 py-1 hover:bg-gray-300 rounded"
                    onClick={() => router.push("/context-form")}
                >
                    {t("context")}
                </button>
                <button
                    className="text-left px-2 py-1 hover:bg-gray-300 rounded"
                    onClick={() => { router.push("/export") }}>
                    {t("export")}
                </button>
                <button
                    className="text-left px-2 py-1 hover:bg-gray-300 rounded"
                    onClick={() => { router.push("/summary") }}
                >
                    {t("documents")}
                </button>
            </nav>

            {/* FOOTER: SETTINGS + HELP */}
            <div className="p-4 flex flex-col gap-3">
                <button className="text-left px-2 py-1 hover:bg-gray-300 rounded">
                    ⚙ {t("configuration")} (WIP)
                </button>
                <button className="text-left px-2 py-1 hover:bg-gray-300 rounded">
                    ❓ {t("help")} (WIP)
                </button>
            </div>
        </aside>
    );
}


export default Sidebar;