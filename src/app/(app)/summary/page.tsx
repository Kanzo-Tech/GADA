"use client";

import { useEffect, useState } from "react";
import { GeneratedConfig, loadGeneratedConfigs, removeGeneratedConfig, saveContextDraft } from "@/components/local-storage";
import { navigation } from "@/components/redirecting";
import '../../styles/summary.css';
import '../../styles/globals.css';

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

    // if (configs.length === 0) {
    //     return (
    //         <div className="p-6 space-y-3">
    //             <h1 className="text-2xl font-semibold">Generated documents</h1>
    //             <p className="text-sm text-gray-600">
    //                 No se han definido documentos aún.
    //             </p>
    //             <button
    //                 className="px-3 py-2 text-sm border rounded"
    //                 onClick={() => navigateTo('/context-form')}
    //             >
    //                 Crea tu primer documento
    //             </button>
    //         </div>
    //     );
    // }


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-start items-center p-4">
            <div className="w-full grid gap-4">
                {configs.length === 0 ? (
                    <div className="mt-3">
                        <h3 className="text-lg font-medium text-gray-900">No se han generado documentos aún.</h3>
                        <p className="mt-1 text-sm text-gray-500 mb-6">Para comenzar con la generación de las plantillas pulse el botón a continuación.</p>
                        <button type="button" className="submit-button" onClick={() => navigateTo('/context-form')}>Acceder al formulario</button>
                    </div>
                ) : (
                    <div className="space-y-4 w-full">
                        <div className="title-div-summary">
                            <h1 className="h1-style">Documentos generados</h1>
                            <p className="text-gray-500 text-lg mt-2">Listado de plantillas listas para descargar y usar</p>
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
                                                <span className="font-semibold text-indigo-700">Entidad:</span>{" "}
                                                {cfg.managingEntity.name || "N/A"}
                                            </div>
                                            <div>
                                                <span className="font-semibold text-indigo-700">Formatos:</span>{" "}
                                                {cfg.outputFormats.join(", ") || "—"}
                                            </div>
                                            <div className="sm:col-span-2">
                                                <span className="font-semibold text-indigo-700">Docs:</span>{" "}
                                                <span className="italic">{cfg.docTypes.join(", ") || "—"}</span>
                                            </div>
                                            <div className="sm:col-span-2 text-xs text-gray-500">
                                                <span className="font-semibold text-indigo-600/70">Regulaciones:</span>{" "}
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
                                            Descargar
                                        </button>
                                        
                                        <div className="flex flex-1 gap-2">
                                            <button
                                                onClick={() => handleEdit(cfg)}
                                                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-indigo-200 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleRemove(cfg)}
                                                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-red-200 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                    )}
                {/* {configs.map((cfg) => (
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
                ))} */}
            </div>
        </div>
    );
}

export default SummaryView;
