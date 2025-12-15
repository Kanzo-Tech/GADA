import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="h-full flex">
            <main className="flex-1 h-full overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
