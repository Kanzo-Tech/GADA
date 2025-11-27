"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GeneratedConfig, loadGeneratedConfigs, saveContextDraft } from "@/components/local-storage";

function SummaryView() {
    const [configs, setConfigs] = useState<GeneratedConfig[]>([]);
    const router = useRouter();

    useEffect(() => {
        setConfigs(loadGeneratedConfigs());
    }, []);

    const handleEdit = (cfg: GeneratedConfig) => {
        // push this config back into the draft so the wizard is prefilled
        saveContextDraft({
            managingEntity: cfg.managingEntity,
            dataSpace: cfg.dataSpace,
            technicalAuthority: cfg.technicalAuthority,
            version: cfg.version,
            date: cfg.date,
            docTypes: cfg.docTypes,
            outputFormats: cfg.outputFormats,
            alignedRegulations: cfg.allignedRegulations,
        });

        // send user back to first step to edit
        router.push("/views/context-form"); // adjust route name
    };

    if (configs.length === 0) {
        return (
            <div className="p-6 space-y-3">
                <h1 className="text-2xl font-semibold">Generated documents</h1>
                <p className="text-sm text-gray-600">
                    You haven&apos;t defined any documents yet.
                </p>
                <button
                    className="px-3 py-2 text-sm border rounded"
                    onClick={() => router.push("/export")} // your DocgenForm route
                >
                    Create first document
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-semibold">Generated documents</h1>

            <div className="space-y-3">
                {configs.map((cfg) => (
                    <div
                        key={cfg.id}
                        className="border rounded-lg p-4 flex flex-col gap-2 bg-white shadow-sm"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="text-sm font-semibold">
                                    {cfg.dataSpace.name || "Unnamed data space"}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Version {cfg.version} ·{" "}
                                    {cfg.date.toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </div>
                            </div>
                            <button
                                className="px-3 py-1 text-xs border rounded"
                                onClick={() => handleEdit(cfg)}
                            >
                                Edit
                            </button>
                        </div>

                        <div className="text-xs text-gray-700">
                            <div>
                                <span className="font-medium">Docs:</span>{" "}
                                {cfg.docTypes.join(", ") || "—"}
                            </div>
                            <div>
                                <span className="font-medium">Formats:</span>{" "}
                                {cfg.outputFormats.join(", ") || "—"}
                            </div>
                            <div>
                                <span className="font-medium">Regulations:</span>{" "}
                                {cfg.allignedRegulations.join(", ") || "—"}
                            </div>
                            <div>
                                <span className="font-medium">Managing entity:</span>{" "}
                                {cfg.managingEntity.name}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SummaryView;
