"use client";

import { useEffect, useState } from "react";
import { GeneratedConfig, loadGeneratedConfigs, removeGeneratedConfig, saveContextDraft } from "@/components/local-storage";
import { navigation } from "@/components/redirecting";

function SummaryView() {
    const [configs, setConfigs] = useState<GeneratedConfig[]>([]);
    const { navigateTo } = navigation();

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
        navigateTo('/context-form');
    };

    const handleRemove = (cfg: GeneratedConfig) => {
        removeGeneratedConfig(cfg.id);
        setConfigs(loadGeneratedConfigs());
    }

    if (configs.length === 0) {
        return (
            <div className="p-6 space-y-3">
                <h1 className="text-2xl font-semibold">Generated documents</h1>
                <p className="text-sm text-gray-600">
                    You haven&apos;t defined any documents yet.
                </p>
                <button
                    className="px-3 py-2 text-sm border rounded"
                    onClick={() => navigateTo('/context-form')} // your DocgenForm route
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
                                    {cfg.docTypes + " "}
                                    {cfg.dataSpace.name || "[Unnamed data space]"}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Version {cfg.version} ·{" "}
                                    {cfg.date.toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "numeric",
                                        second: "numeric"
                                    })}
                                </div>
                            </div>
                            <div>
                                <button
                                    className="px-3 py-1 text-xs border rounded mr-2"
                                    onClick={() => handleEdit(cfg)}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleRemove(cfg)}
                                    className="text-xs px-3 py-1 bg-danger border hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs rounded focus:outline-none"
                                >
                                    Delete
                                </button>
                            </div>
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
