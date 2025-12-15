import Sidebar from "@/components/sidebar";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="h-full flex">
            <Sidebar />
            <main className="flex-1 h-full overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
