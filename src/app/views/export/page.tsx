"use client";

import { useState } from 'react';
import { InputField, MultiSelectField, SelectOption } from '../../../components/form-fields';
import '../../styles/doc-gen.css'
import { navigation } from '@/components/redirecting';
import { addGeneratedConfigFromDraft, clearContextDraft, loadContextDraft, mergeContextDraft } from '@/components/local-storage';

const docTypes: SelectOption[] = [
    { label: "Data space rulebook", value: "dataspace-rb" },
    { label: "Membership agreement", value: "membership-agreement" },
    { label: "General terms and conditions", value: "general-tc" },
]

const outputFormats: SelectOption[] = [
    { label: "PDF", value: "pdf" },
    { label: "Word", value: "word" },
    { label: "JSON-LD", value: "jsonld" },
    { label: "RDF (N-Triples, Turtle, RDF/XML...", value: "rdf" }
]

const regulationsAlligned: SelectOption[] = [
    { label: "GDPR", value: "gdpr" },
    { label: "Data act", value: "data-act" },
    { label: "Data governance act", value: "data-governance-act" },
    { label: "Others...", value: "others" },
]


function DocgenForm() {
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
        <div>
            <section>
                <div className="docgen-form m-4 p-4 gap-4 border border-slate-800 rounded-2xl">
                    <MultiSelectField
                        label='Documents to be generated'
                        options={docTypes}
                        value={selectedDocTypes}
                        onChange={setSelectedDocTypes}
                    />
                    <MultiSelectField
                        label='Output format'
                        options={outputFormats}
                        value={selectedOutputFormats}
                        onChange={setSelectedOutputFormats}
                    />
                    <MultiSelectField
                        label='Allignment with regulations'
                        options={regulationsAlligned}
                        value={selectedAllignedRegulations}
                        onChange={setAllignedRegulations}
                    />
                </div >
            </section >
            <button
                type="button"
                onClick={handleSubmit}
                className="ml-4 px-4 py-2 rounded-md border text-sm font-medium"
            >
                Submit
            </button>
        </div >
    );
}


export default DocgenForm;