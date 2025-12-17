"use client";

import { useState } from 'react';
import '../../../styles/export.css';
import '../../../styles/globals.css';
import { navigation } from '@/components/redirecting';
import { addGeneratedConfigFromDraft, clearContextDraft, loadContextDraft, mergeContextDraft } from '@/components/local-storage';
import { MultiSelectField, SelectOption } from '@/components/form-fields';
import { useTranslations } from 'next-intl';

export const docTypes: SelectOption[] = [
    { label: "Data space rulebook", value: "dataspace-rb" },
    { label: "Membership agreement", value: "membership-agreement" },
    { label: "General terms and conditions", value: "general-tc" },
]

const outputFormats: SelectOption[] = [
    { label: "PDF", value: "pdf", disabled: true },
    { label: "Word", value: "word" },
    { label: "JSON-LD", value: "jsonld", disabled: true },
    { label: "RDF (N-Triples, Turtle, RDF/XML...", value: "rdf", disabled: true }
]

const regulationsAlligned: SelectOption[] = [
    { label: "GDPR", value: "gdpr", checkedMandatory: true },
    { label: "Data act", value: "data-act", checkedMandatory: true },
    { label: "Data governance act", value: "data-governance-act", checkedMandatory: true },
    { label: "Others...", value: "others" },
]


function DocgenForm() {
    const t = useTranslations("export");

    const [selectedDocTypes, setSelectedDocTypes] = useState<string[]>([]);
    const [selectedOutputFormats, setSelectedOutputFormats] = useState<string[]>([]);
    const [selectedAllignedRegulations, setAllignedRegulations] = useState<string[]>([]);

    const { navigateTo } = navigation();

    const handleSubmit = () => {
        // merge data into draft
        const draft = mergeContextDraft({
            date: new Date(),
            docTypes: selectedDocTypes,
            outputFormats: selectedOutputFormats,
            alignedRegulations: selectedAllignedRegulations,
        })

        // build a GeneratedConfig and store it
        const generated = addGeneratedConfigFromDraft(draft);
        clearContextDraft();

        if (!generated) {
            navigateTo('/context-form')
            return;
        }

        // go to summary list
        navigateTo('/summary')
    }

    /**
     * Handle submit previo a localStorage
    */
    // const handleSubmit = () => {
    //     const params = new URLSearchParams();

    //     const appendArray = (key: string, values: string[]) => {
    //         values.forEach((v) => params.append(key, v));
    //     }

    //     appendArray("docTypes", selectedDocTypes)
    //     appendArray("outputFormats", selectedOutputFormats)
    //     appendArray("allignedRegulations", selectedAllignedRegulations)

    //     params.set("versionLabel", versionLabel ?? "")

    //     mergeContextDraft({
    //         version: versionLabel,
    //         date: new Date()
    //     });

    //     navigateTo(`/summary=${params.toString()}`);
    // }


    loadContextDraft();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="father-div-export">
                <div className="max-w-4xl w-full text-start mb-8">
                    <h1 className="h1-style">
                        {t("exportTitle")}
                    </h1>
                    <p className="text-gray-500 text-lg mt-2">
                        {t("exportDescription")}
                    </p>
                </div>
                <div className="w-full grid gap-4">
                    <div className="checkbox-container-export">
                        <div className="columns-style-3">
                            <div className="space-y-4">
                                <MultiSelectField
                                    label={t("documentTitle")}
                                    options={docTypes}
                                    value={selectedDocTypes}
                                    onChange={setSelectedDocTypes}
                                />
                            </div>
                            <div className="space-y-4 md:border-l md:border-r md:border-gray-100 md:px-6">
                                <MultiSelectField
                                    label={t("outputFormatTitle")}
                                    options={outputFormats}
                                    value={selectedOutputFormats}
                                    onChange={setSelectedOutputFormats}
                                />
                            </div>
                            <div className="space-y-4">
                                <MultiSelectField
                                    disabled={true}
                                    label={t("allignmentWithRegulations")}
                                    options={regulationsAlligned}
                                    value={selectedAllignedRegulations}
                                    onChange={setAllignedRegulations}
                                />
                            </div>
                        </div>
                    </div>
                </div>


                <div className="w-full pt-6 flex justify-center">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="submit-button"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}


export default DocgenForm;