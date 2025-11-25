"use client";

import { InputField, SelectOption, NumericField, SelectField, TextAreaField } from "@/components/form-fields";
import React, { useState } from "react";
import '../../styles/context-layout.css';
import { navigation } from "@/components/redirecting";


const sectorTypeOptions: SelectOption[] = [
    { label: "example1", value: "example1" },
    { label: "example2", value: "example2" }
]

const geographicScopeOptions: SelectOption[] = [
    { label: "example1", value: "example1" },
    { label: "example2", value: "example2" }
]

type ManagingEntity = {
    name: string,
    taxId: string,
    address: string,
    legalRepresentative: string
}

type DataSpace = {
    name: string,
    sector: string,
    geographicScope: string,
    participantType: string,
    numberOfParticipants?: number,
    scopeAndPurpose: string
}

type TechnicalAuthority = {
    legalName: string,
    taxId: string,
    governanceRole: string,
    geographicScope: string,
    contact: string
}

function ContextForm() {

    const [managingEntity, setManagingEntity] = useState<ManagingEntity>({
        name: "",
        taxId: "",
        address: "",
        legalRepresentative: ""
    })

    const [technicalAuthority, setTechnicalAuthority] = useState<TechnicalAuthority>({
        legalName: "",
        taxId: "",
        governanceRole: "",
        geographicScope: "",
        contact: ""
    })

    const [dataspace, setDataSpace] = useState<DataSpace>({
        name: "",
        sector: "",
        geographicScope: "",
        participantType: "",
        numberOfParticipants: undefined,
        scopeAndPurpose: ""
    })

    const [checked, setChecked] = useState(false);

    const handleManagingChange =
        (field: keyof ManagingEntity) =>
            (value: string) => {
                setManagingEntity((prev) => ({ ...prev, [field]: value }))
            };

    const handleDataSpaceChange =
        (field: keyof DataSpace) =>
            (value: string) => {
                setDataSpace((prev) => ({ ...prev, [field]: value }))
            }

    const handleTechnicalChange =
        (field: keyof TechnicalAuthority) =>
            (value: string) => {
                setTechnicalAuthority((prev) => ({ ...prev, [field]: value }));
            };

    const handleNumberOfParticipantsChange = (value?: number) => {
        setDataSpace((prev) => ({ ...prev, numberOfParticipants: value }));
    };

    const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setChecked(isChecked);


        if (isChecked) {
            setTechnicalAuthority((prev) => ({
                ...prev,
                legalName: managingEntity.name,
                taxId: managingEntity.taxId
            }))
        } else {
            setTechnicalAuthority((prev) => (
                {
                    ...prev,
                    legalName: "",
                    taxId: "",
                }))
        }
    }
    const { navigateTo } = navigation();

    const handleSubmit = () => {
        navigateTo('/export');
    }


    return (
        <div>
            <div className="ml-4 mt-4 max-w text-start">
                <h1 className="text-4xl font-bold text-slate-900">Provide a formal context to your dataspace</h1>
                <p className="text-gray-500 text-lg">Fill the form with the most basic metadata that describe your dataspace</p>
            </div>

            <div className="border rounded-2xl border-gray-500 m-5 p-15">
                <div className="grid grid-cols-2">
                    <div className="context-div">
                        <h2 className="text-2xl">Managing entity</h2>
                        <div className="context-form">
                            <InputField
                                title="Name"
                                placeholder="Name..."
                                onChange={handleManagingChange("name")}
                            />
                            <InputField
                                title="Tax ID"
                                placeholder="Tax id..."
                                onChange={handleManagingChange("taxId")}
                            />
                            <InputField
                                title="Address"
                                placeholder="Address..."
                                onChange={handleManagingChange("address")}
                            />
                            <InputField
                                title="Legal representative"
                                placeholder="Legal representative..."
                                onChange={handleManagingChange("legalRepresentative")}
                            />
                        </div>
                        <div className="flex items-center mb-4">
                            <input
                                onChange={handleChecked}
                                type="checkbox"
                                checked={checked}
                                className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"
                            />
                            <label className="select-none ms-2 m-10 text-sm font-medium text-heading">
                                Technical authority matches managing entity
                            </label>
                        </div>
                    </div>

                    <div className="context-div">
                        <h2 className="text-2xl">Data Space information</h2>
                        <div className="context-form">
                            <InputField
                                title="Name"
                                placeholder="Data space name..."
                                value={dataspace.name}
                                onChange={handleDataSpaceChange("name")}
                            />
                            <SelectField
                                label="Sector"
                                placeholder="Select a sector"
                                value={dataspace.sector}
                                options={sectorTypeOptions}
                                onChange={(e) => handleDataSpaceChange("scopeAndPurpose")(e)}
                            />
                            <SelectField
                                label="Geographic scope"
                                placeholder="Select a scope"
                                value={dataspace.geographicScope}
                                options={geographicScopeOptions}
                                onChange={(e) => handleDataSpaceChange("geographicScope")(e)}
                            />
                            <NumericField
                                title="Number of participants"
                                placeholder="Number of participants..."
                                onChange={(e) => handleNumberOfParticipantsChange(e)}
                            />
                            <InputField
                                title="Participant type"
                                placeholder="Participant type..."
                                value={dataspace.participantType}
                                onChange={handleDataSpaceChange("participantType")}
                            />
                            <TextAreaField
                                title="Scope and purpose"
                                placeholder="Scope and purpose..."
                                value={dataspace.scopeAndPurpose}
                                onChange={handleDataSpaceChange("scopeAndPurpose")}
                            />
                        </div>
                    </div>
                </div>
                <div className="mb-4 space-y-4">
                    <h2 className="text-2xl">Technical authority</h2>
                    <div className="context-form">
                        <InputField
                            title="Legal name"
                            value={technicalAuthority.legalName}
                            placeholder="Legal name..."
                            onChange={handleTechnicalChange("legalName")}
                        />
                        <InputField
                            title="Tax Id"
                            value={technicalAuthority.taxId}
                            placeholder="Tax Id..."
                            onChange={handleTechnicalChange("taxId")}
                        />
                        <InputField
                            title="Governance role"
                            placeholder="Role..."
                            onChange={handleTechnicalChange("governanceRole")}
                        />
                        <InputField
                            title="Contact information"
                            placeholder="contact@information.com"
                            onChange={handleTechnicalChange("contact")}
                        />
                        <SelectField
                            label="Geographic scope"
                            placeholder="Select a scope"
                            options={geographicScopeOptions}
                            onChange={(e) => handleTechnicalChange("geographicScope")(e)}
                        />

                    </div>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="ml-4 px-4 py-2 rounded-md border text-sm font-medium"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ContextForm;