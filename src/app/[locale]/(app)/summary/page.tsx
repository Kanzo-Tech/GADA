"use client";

import { useEffect, useState } from "react";
import { GeneratedConfig, loadGeneratedConfigs, removeGeneratedConfig, saveContextDraft } from "@/components/local-storage";
import { navigation } from "@/components/redirecting";
import { useTranslations } from "next-intl";
import '../../../styles/summary.css';
import '../../../styles/globals.css';
import { useRouter } from "@/i18n/navigation";

function SummaryView() {
    const router = useRouter();
    const t = useTranslations("summary")

    const [configs, setConfigs] = useState<GeneratedConfig[]>([]);

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

        router.push("/context-form");
    };

    const handleRemove = (cfg: GeneratedConfig) => {
        removeGeneratedConfig(cfg.id);
        setConfigs(loadGeneratedConfigs());
    }

    const handleDownload = async (cfg: GeneratedConfig) => {
        try {
            // Llamada a generación de documento
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

            //Llamada a descarga de documento
            const filename = response.headers.get("Filename") ?? "documento.docx";

            const blob = await response.blob();

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

        } catch (err) {
            console.error('Error descargando el documento', err)
            alert('Error descargando el documento');
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-start items-center p-4">
            <div className="w-full grid gap-4">
                {configs.length === 0 ? (
                    <div className="mt-3">
                        <h3 className="text-lg font-medium text-gray-900">{t("message")}</h3>
                        <p className="mt-1 text-sm text-gray-500 mb-6">{t("descriptionEmpty")}</p>
                        <button type="button" className="submit-button" onClick={() => router.push("/context-form")}>{t("create")}</button>
                    </div>
                ) : (
                    <div className="space-y-4 w-full">
                        <div className="title-div-summary">
                            <h1 className="h1-style">{t("title")}</h1>
                            <p className="text-gray-500 text-lg mt-2">{t("description")}</p>
                        </div>
                        {configs.map((cfg) => (
                            <div
                                key={cfg.id}
                                className="checkbox-container-export w-full flex-col md:flex-row md:items-center gap-6"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-xl font-bold text-indigo-900 truncate">
                                            {cfg.dataSpace.name || "[Unnamed data space]"}
                                        </h2>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                            v{cfg.version || "1.0"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3">
                                        Generado el {cfg.date.toLocaleDateString(undefined, {
                                            year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
                                        })}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 bg-white/50 p-3 rounded-md border border-indigo-100/50">
                                        <div>
                                            <span className="font-semibold text-indigo-700">{t("entity")}</span>{" "}
                                            {cfg.managingEntity.name || "N/A"}
                                        </div>
                                        <div>
                                            <span className="font-semibold text-indigo-700">{t("format")}</span>{" "}
                                            {cfg.outputFormats.join(", ") || "—"}
                                        </div>
                                        <div className="sm:col-span-2">
                                            <span className="font-semibold text-indigo-700">{t("documents")}</span>{" "}
                                            <span className="italic">{cfg.docTypes.join(", ") || "—"}</span>
                                        </div>
                                        <div className="sm:col-span-2 text-xs text-gray-500">
                                            <span className="font-semibold text-indigo-600/70">{t("regulations")}</span>{" "}
                                            {cfg.allignedRegulations.join(", ") || "—"}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto mt-4 md:mt-0">
                                    <button
                                        onClick={() => handleDownload(cfg)}
                                        className="flex-1 md:flex-none inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                                    >
                                        <svg className="mr-2 -ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        {t("download")}
                                    </button>

                                    <div className="flex flex-1 gap-2">
                                        <button
                                            onClick={() => handleEdit(cfg)}
                                            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-indigo-200 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                                        >
                                            {t("edit")}
                                        </button>
                                        <button
                                            onClick={() => handleRemove(cfg)}
                                            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-red-200 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                                        >
                                            {t("delete")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SummaryView;