"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { version } from "os";
import * as React from "react";

const normalize = (param: string | string[] | undefined): string[] =>
    Array.isArray(param) ? param : param ? [param] : [];

export default function SummaryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const docTypes = searchParams.getAll('docTypes');
    const outputFormats = searchParams.getAll('outputFormats');
    const allignedRegulations = searchParams.getAll('allignedRegulations');

    const versionLabel = searchParams.get("versionLabel");

    const handleClick = () => {
        router.push("/docgen")
    }

    return (
        <div className="p-6 flex flex-col gap-4">
            <h1 className="text-xl font-semibold">Resumen de selección</h1>

            {docTypes.length ? (
                <ul className="list-disc list-inside">
                    {docTypes.map((docType) => (
                        <li key={docType}>{docType}</li>
                    ))}
                </ul>
            ) : (
                <p>No se ha seleccionado ningún tipo de documento</p>
            )

            }

            {outputFormats.length ? (

                <ul className="list-disc list-inside">
                    {outputFormats.map((outputFormats) => (
                        <li key={outputFormats}>{outputFormats}</li>
                    ))}
                </ul>
            ) : (
                <p>No se ha seleccionado ningún output format</p>
            )
            }

            {allignedRegulations.length ? (

                <ul className="list-disc list-inside">
                    {allignedRegulations.map((allignedRegulations) => (
                        <li key={allignedRegulations}>{allignedRegulations}</li>
                    ))}
                </ul>
            ) : (
                <p>No se ha seleccionado ningún alligned regulation</p>
            )
            }

            {versionLabel ?
                <p>{versionLabel}</p>
                : (
                    <p>No hay version label</p>
                )
            }

            <button
                onClick={handleClick}
            >
                Return
            </button>
        </div>
    );
}