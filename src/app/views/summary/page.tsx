"use client";

import { useEffect, useState } from "react";
import { GeneratedConfig, loadGeneratedConfigs, removeGeneratedConfig, saveContextDraft } from "@/components/local-storage";
import { navigation } from "@/components/redirecting";
import { docTypes } from "../export/page";

function SummaryView() {
    const [configs, setConfigs] = useState<GeneratedConfig[]>([]);
    const { navigateTo } = navigation();

    useEffect(() => {
        const all = loadGeneratedConfigs();
        setConfigs(all);
    }, []);

    const handleEdit = (cfg: GeneratedConfig) => {
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

        navigateTo('/context-form');
    };

    const handleRemove = (cfg: GeneratedConfig) => {
        removeGeneratedConfig(cfg.id);
        setConfigs(loadGeneratedConfigs());
    }

    const handleDownload = async (cfg: GeneratedConfig) => {
        // const documentsToBeGenerated = cfg.docTypes[0];

        const response = await fetch('/api/document-generation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cfg: cfg,
            }),
        });
        if (!response.ok) {
            alert(response.statusText);
            return;
        }
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
                    onClick={() => navigateTo('/context-form')}
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
                                    className="text-xs m-1 px-3 py-1 bg-danger border hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs rounded focus:outline-none"
                                    onClick={() => handleEdit(cfg)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="text-xs m-1 px-3 py-1 bg-danger border hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs rounded focus:outline-none"
                                    onClick={() => handleDownload(cfg)}
                                >
                                    Download
                                </button>
                                <button
                                    className="text-xs m-1 px-3 py-1 bg-danger border hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs rounded focus:outline-none"
                                    onClick={() => handleRemove(cfg)}
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
