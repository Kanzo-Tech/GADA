"use client";

import { InputField, SelectOption } from "@/components/form-fields";
import React, { useState } from "react";
import '../../styles/context-layout.css';
import { navigation } from "@/components/redirecting";
import { IFormData } from "@/components/i-form-data";

const sectorTypeOptions: SelectOption[] = [
    { label: "example1", value: "example1" },
    { label: "example2", value: "example2" }
];

const geographicScopeOptions: SelectOption[] = [
    { label: "example1", value: "example1" },
    { label: "example2", value: "example2" }
];

function ContextForm() {
    const [formData, setFormData] = useState<IFormData>({
        managingEntity: {
            name: '',
            taxId: '',
            address: '',
            legalRepresentative: ''
        },
        dataSpace: {
            name: '',
            sector: '',
            geographicScope: '',
            scopeAndPurpose: ''
        },
        technicalAuthority: {
            legalName: '',
            taxId: '',
            governanceRole: '',
            geographicScope: '',
            contact: ''
        },
        numberOfParticipants: undefined,
        participantType: '',
        version: '',
        date: ''
    });

    const handleManagingChange = (field: string, newValue: any) => {
        setFormData({
            ...formData,
            managingEntity: {
                ...formData.managingEntity,
                [field]: newValue
            }
        });
    };

    const handleDataSpaceChange = (field: string, newValue: any) => {
        setFormData({
            ...formData,
            dataSpace: {
                ...formData.dataSpace,
                [field]: newValue
            }
        });
    };

    const handleTechnicalChange = (field: string, newValue: any) => {
        setFormData({
            ...formData,
            technicalAuthority: {
                ...formData.technicalAuthority,
                [field]: newValue
            }
        });
    };

    const [errorTaxId, setErrorTaxId] = useState({managingEntityTaxId: "", technicalAuthorityTaxId: ""});
    const validateTaxId = (formValue: string, type: 'managingEntityTaxId' | 'technicalAuthorityTaxId') => {
        if (!formValue) {
            setErrorTaxId(prev => ({ ...prev, [type]: "You can't leave this field empty"}));
        }

        const validCifRegex = /^[AB][0-9]{8}$/;
        const validNifNieRegex = /^[XYZ0-9][0-9]{7}[A-Z]$/;
        if (validCifRegex.test(formValue) || validNifNieRegex.test(formValue)) {
            setErrorTaxId(prev => ({ ...prev, [type]: ""}));
        } else {
            setErrorTaxId(prev => ({
                ...prev,
                [type]: "You should enter a valid CIF, NIF or NIE."
            }));
        }
    };

    const [errorBlankMandatoryField, setErrorMandatoryField] = useState({
        managingEntityName: "",
        managingEntityAddress: "",
        managingEntityLegalRepresentative: "",
        dataSpaceName: "",
        dataSpaceScopeAndPurpose: "",
        technicalAuthorityLegalName: ""
    });
    const validateMandatoryField = (formValue: string, mandatoryField: keyof typeof errorBlankMandatoryField) => {
        if (!formValue || formValue.trim() === '') {
            setErrorMandatoryField(prev => ({
                ...prev,
                [mandatoryField]: "You can't leave this field blank, it's mandatory."
            }));
        } else {
            setErrorMandatoryField(prev => ({ ...prev, [mandatoryField]: ""}))
        }
    };

    const [errorSimpleTextMandatory, setErrorSimpleTextMandatory] = useState({ dataSpaceSector: "", dataSpaceGeographicScope: ""})
    const validateSimpleTextMandatoryField = (formValue: string, type: 'dataSpaceSector' | 'dataSpaceGeographicScope') => {
        if (!formValue || formValue.trim() === ''){
            setErrorSimpleTextMandatory(prev => ({
                ...prev,
                [type]: "You can't leave this field blank, it's mandatory."
            }));
            return;
        }

        const simpleTextRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

        if (!simpleTextRegex.test(formValue)){
            setErrorSimpleTextMandatory(prev => ({
                ...prev,
                [type]: "Invalid format, you may only enter letters and spaces."
            }));
            return;
        }

        setErrorSimpleTextMandatory(prev => ({ ...prev, [type]: ""}));
    };

    const [managingEqualsTechnicalChecked, setChecked] = useState(false);
    const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;

        if (isChecked) {
            const managingEntityName = formData.managingEntity.name.trim();
            const managingEntityTaxId = formData.managingEntity.taxId.trim();

            if (managingEntityName === '' || managingEntityTaxId === ''){
                if (managingEntityName === '') alert("Missing the required field name of the managing entity.");
                if (managingEntityTaxId === '') alert("Missing the required field tax id of the managing entity.");
                return;
            }
            if (errorTaxId.managingEntityTaxId != ''){
                alert("You should enter a valid CIF, NIF or NIE for the managing entity before clicking the checkbox.");
                return;
            }

            setChecked(true);
            setErrorMandatoryField(prev => ({
                ...prev,
                technicalAuthorityLegalName: ''
            }));
            setErrorTaxId(prev => ({
                ...prev,
                technicalAuthorityTaxId: ''
            }))
            setFormData(() => ({
                ...formData,
                technicalAuthority: {
                    ...formData.technicalAuthority,
                    legalName: formData.managingEntity.name,
                    taxId: formData.managingEntity.taxId
                }
            }));
        } else {
            setChecked(false);
            setFormData(() => ({
                ...formData,
                technicalAuthority: {
                    ...formData.technicalAuthority,
                    legalName: '',
                    taxId: ''
                }
            }));
        }
    };

    const { navigateTo } = navigation();

    const checkForErrors = async (formDataToBeChecked: IFormData) => {
        var error = ""
        validateMandatoryField(formDataToBeChecked.managingEntity.name, "managingEntityName");
        validateMandatoryField(formDataToBeChecked.managingEntity.address, "managingEntityAddress");
        validateMandatoryField(formDataToBeChecked.managingEntity.legalRepresentative, "managingEntityLegalRepresentative");
        validateMandatoryField(formDataToBeChecked.dataSpace.name, "dataSpaceName");
        validateMandatoryField(formDataToBeChecked.dataSpace.scopeAndPurpose, "dataSpaceScopeAndPurpose");
        validateTaxId(formDataToBeChecked.managingEntity.taxId, "managingEntityTaxId");
        validateSimpleTextMandatoryField(formDataToBeChecked.dataSpace.sector, "dataSpaceSector");
        validateSimpleTextMandatoryField(formDataToBeChecked.dataSpace.geographicScope, "dataSpaceGeographicScope");
        if (!managingEqualsTechnicalChecked) {
            validateMandatoryField(formDataToBeChecked.technicalAuthority.legalName, "technicalAuthorityLegalName");
            validateTaxId(formDataToBeChecked.technicalAuthority.taxId, "technicalAuthorityTaxId");
        }
        if (errorBlankMandatoryField.managingEntityName != "" || errorBlankMandatoryField.managingEntityAddress != ""
            || errorBlankMandatoryField.managingEntityLegalRepresentative != "" || errorBlankMandatoryField.dataSpaceName != "" 
            || errorBlankMandatoryField.dataSpaceScopeAndPurpose != "" || errorTaxId.managingEntityTaxId != "" || errorTaxId.technicalAuthorityTaxId != ""
            || errorTaxId.technicalAuthorityTaxId != "" || errorSimpleTextMandatory.dataSpaceSector != "" || errorSimpleTextMandatory.dataSpaceGeographicScope != ""
            || formDataToBeChecked.managingEntity.name === "" || formDataToBeChecked.managingEntity.address === "" || formDataToBeChecked.managingEntity.legalRepresentative === ""
            || formDataToBeChecked.dataSpace.name === "" || formDataToBeChecked.dataSpace.scopeAndPurpose === "" || formDataToBeChecked.managingEntity.taxId === ""
            || formDataToBeChecked.dataSpace.sector === "" || formDataToBeChecked.dataSpace.geographicScope === "" || formDataToBeChecked.technicalAuthority.legalName === ""
            || formDataToBeChecked.technicalAuthority.taxId === ""
        ) {
            error = "The form has to be filled correctly. Check the errors to solve them before submitting.";
        }
        return error;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const submitDate = new Date();
        const formattedDate = submitDate.toLocaleDateString('es-Es', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const finalFormData:IFormData = {
            ...formData,
            date: formattedDate
        };
        const error = await checkForErrors(finalFormData);
        if (error != "") {
            alert(error);
            return;
        }
        const response = await fetch('/api/document-generation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(finalFormData),
        });
        if (response.ok) {
            //navigateTo('/export');
        } else {
            alert("The form has to be filled correctly. Check the errors to solve them before submitting.");
            return;
        }
        //navigateTo('/export');
    }


    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            <div className="max-w-4xl w-full text-start mb-8 ml-2">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Provide a formal context to your dataspace</h1>
                <p className="text-gray-500 text-lg mt-2">Fill the form with the most basic metadata that describe your dataspace</p>
            </div>

            <div className="max-w-4xl w-full bg-white border border-gray-200 rounded-2xl shadow-xl p-8 md:p-12 space-y-10">
                <section className="space-y-6">
                    <div className="title-div">
                        <h2 className="h2-style">Managing entity</h2>
                    </div>
                        <div className="context-form-inputs">
                            <InputField
                                type="text"
                                label="Name"
                                minLength={3}
                                value={formData.managingEntity.name}
                                placeholder="Juan Teodomiro López Navarrete"
                                onBlur={() => {
                                    handleManagingChange("name", formData.managingEntity.name.trim());
                                    validateMandatoryField(formData.managingEntity.name, 'managingEntityName');
                                }}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (errorBlankMandatoryField.managingEntityName) setErrorMandatoryField(prev => ({ ...prev, managingEntityName: ""}));

                                    handleManagingChange("name", val);
                                }}
                                error={errorBlankMandatoryField.managingEntityName}
                            />
                            <InputField
                                type="text"
                                label="Tax id"
                                maxLength={9}
                                value={formData.managingEntity.taxId}
                                placeholder="X1234567X"
                                onBlur={() => validateTaxId(formData.managingEntity.taxId, 'managingEntityTaxId')}
                                onChange={(e) => {
                                    const val = e.target.value.trim().toUpperCase();
                                    if (errorTaxId.managingEntityTaxId) setErrorTaxId(prev => ({ ...prev, managingEntityTaxId: ""}));

                                    handleManagingChange("taxId", val);
                                }}
                                error={errorTaxId.managingEntityTaxId}
                            />
                            <InputField
                                type="text"
                                label="Address"
                                minLength={7}
                                value={formData.managingEntity.address}
                                placeholder="Avenida de Cervantes, 2, 29071 Malaga"
                                onBlur={() => {
                                    handleManagingChange("address", formData.managingEntity.address.trim());
                                    validateMandatoryField(formData.managingEntity.address, 'managingEntityAddress');
                                }}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (errorBlankMandatoryField.managingEntityAddress) setErrorMandatoryField(prev => ({ ...prev, managingEntityAddress: ""}));

                                    handleManagingChange("address", val);
                                }}
                                error={errorBlankMandatoryField.managingEntityAddress}
                            />
                            <InputField
                                type="text"
                                label="Legal representative name"
                                minLength={3}
                                placeholder="Tony Chopper..."
                                onBlur={() => {
                                    handleManagingChange("legalRepresentative", formData.managingEntity.legalRepresentative.trim());
                                    validateMandatoryField(formData.managingEntity.legalRepresentative, 'managingEntityLegalRepresentative');
                                }}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (errorBlankMandatoryField.managingEntityLegalRepresentative) setErrorMandatoryField(prev => ({ ...prev, managingEntityLegalRepresentative: ""}));

                                    handleManagingChange("legalRepresentative", val);
                                }}
                                error={errorBlankMandatoryField.managingEntityLegalRepresentative}
                            />
                        </div>
                </section>
                <section className="checkbox-container">
                    <div className="flex h-6 items-center">
                        <input
                            id="managingEqualsTechnicalCheckbox"
                            onChange={handleChecked}
                            type="checkbox"
                            checked={managingEqualsTechnicalChecked}
                            className="h5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="managingEqualsTechnicalCheckbox" className="font-medium text-gray-900 cursor-pointer">
                            Technical authority matches managing entity
                        </label>
                    </div>             
                </section>
                <section className="space-y-6">
                    <div className="title-div">
                        <h2 className="h2-style">Data Space information</h2>
                    </div>
                    <div className="context-form-inputs">
                        <InputField
                            type="text"
                            label="Name"
                            placeholder="Malaga University..."
                            value={formData.dataSpace.name}
                            onBlur={() => {
                                handleDataSpaceChange("name", formData.dataSpace.name.trim());
                                validateMandatoryField(formData.dataSpace.name, 'dataSpaceName');
                            }}
                            onChange={(e) => {
                                const val = e.target.value;
                                if(errorBlankMandatoryField.dataSpaceName) setErrorMandatoryField(prev => ({ ...prev, dataSpaceName: ""}));

                                handleDataSpaceChange("name", val);
                            }}
                            error={errorBlankMandatoryField.dataSpaceName}
                        />
                        <InputField
                            type="text"
                            label="Sector"
                            placeholder="Education..."
                            value={formData.dataSpace.sector}
                            onBlur={() => {
                                handleDataSpaceChange("sector", formData.dataSpace.sector.trim());
                                validateSimpleTextMandatoryField(formData.dataSpace.sector, 'dataSpaceSector');
                            }}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (errorSimpleTextMandatory.dataSpaceSector) setErrorSimpleTextMandatory(prev => ({ ...prev, dataSpaceSector: ""}));

                                handleDataSpaceChange("sector", val);
                            }}
                            error={errorSimpleTextMandatory.dataSpaceSector}
                        />
                        <InputField
                            type="text"
                            minLength={10}
                            label="Scope and purpose"
                            placeholder="Educational usage for Malaga University..."
                            value={formData.dataSpace.scopeAndPurpose}
                            onBlur={() => {
                                handleDataSpaceChange("sector", formData.dataSpace.scopeAndPurpose.trim());
                                validateMandatoryField(formData.dataSpace.scopeAndPurpose, 'dataSpaceScopeAndPurpose');
                            }}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (errorBlankMandatoryField.dataSpaceScopeAndPurpose) setErrorMandatoryField(prev => ({ ...prev, dataSpaceScopeAndPurpose: ""}));

                                handleDataSpaceChange("scopeAndPurpose", val);
                            }}
                            error={errorBlankMandatoryField.dataSpaceScopeAndPurpose}
                        />
                        <InputField
                            type="text"
                            label="Geographic scope"
                            placeholder="Málaga..."
                            value={formData.dataSpace.geographicScope}
                            onBlur={() => {
                                handleDataSpaceChange("geographicScope", formData.dataSpace.geographicScope.trim());
                                validateSimpleTextMandatoryField(formData.dataSpace.geographicScope, 'dataSpaceGeographicScope');
                            }}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (errorSimpleTextMandatory.dataSpaceGeographicScope) setErrorSimpleTextMandatory(prev => ({ ...prev, dataSpaceGeographicScope: ""}));

                                handleDataSpaceChange("geographicScope", val);                                   
                            }}
                            error={errorSimpleTextMandatory.dataSpaceGeographicScope}
                        />
                    </div>
                </section>
                <section className="space-y-6">
                    <div className="title-div">
                        <h2 className="h2-style">Technical authority</h2>
                    </div>
                    <div className="context-form-inputs">
                        <InputField
                            type="text"
                            label="Legal name"
                            value={formData.technicalAuthority.legalName}
                            placeholder="Ekko Roger..."
                            disabled={managingEqualsTechnicalChecked}
                            onBlur={() => {
                                handleDataSpaceChange("legalName", formData.technicalAuthority.legalName.trim());
                                validateMandatoryField(formData.technicalAuthority.legalName, "technicalAuthorityLegalName");
                            }}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (errorBlankMandatoryField.technicalAuthorityLegalName) setErrorMandatoryField(prev => ({ ...prev, technicalAuthorityLegalName: ""}));
                                
                                handleTechnicalChange("legalName", val.trim());
                            }}
                            error={errorBlankMandatoryField.technicalAuthorityLegalName}
                        />
                        <InputField
                            type="text"
                            label="Tax Id"
                            value={formData.technicalAuthority.taxId}
                            placeholder="Tax Id..."
                            disabled={managingEqualsTechnicalChecked}
                            onBlur={() => validateTaxId(formData.technicalAuthority.taxId, "technicalAuthorityTaxId")}
                            onChange={(e) => {
                                const val = e.target.value.trim().toUpperCase();
                                if (errorTaxId.technicalAuthorityTaxId) setErrorTaxId(prev => ({ ...prev, technicalAuthorityTaxId: ''}));

                                handleTechnicalChange("taxId", val);
                            }}
                            error={errorTaxId.technicalAuthorityTaxId}
                        />
                        <InputField
                            type="text"
                            label="Governance role"
                            placeholder="Administrator..."
                            value={formData.technicalAuthority.governanceRole}
                            onBlur={() => handleTechnicalChange("governanceRole", formData.technicalAuthority.governanceRole)}
                            onChange={(e) => {
                                handleTechnicalChange("governanceRole", e.target.value);
                            }}
                        />
                        <InputField
                            type="email"
                            label="Contact information"
                            placeholder="contact@information.com"
                            value={formData.technicalAuthority.contact}
                            onBlur={() => handleTechnicalChange("contact", formData.technicalAuthority.contact.trim())}
                            onChange={(e) => {
                                handleTechnicalChange("contact", e.target.value)
                            }}
                        />
                        <InputField
                            type="text"
                            label="Geographic scope"
                            placeholder="Málaga..."
                            value={formData.technicalAuthority.geographicScope}
                            onBlur={() => handleTechnicalChange("geographicScope", formData.technicalAuthority.geographicScope.trim())}
                            onChange={(e) => {
                                handleTechnicalChange("geographicScope", e.target.value)
                            }}
                        />
                    </div>
                </section>
                <section className="space-y-6">
                    <div className="title-div"></div>
                    <div className="context-form-inputs">
                        <InputField          
                            type="number"
                            label="Number of participants"
                            placeholder="100"
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    numberOfParticipants: Number.parseInt(e.target.value.trim())
                                });
                            }}
                        />
                        <InputField
                            type="text"
                            label="Participants type"
                            placeholder="Students and teachers..."
                            onBlur={() => setFormData({
                                ...formData,
                                participantType: formData.participantType.trim()
                            })}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    participantType: e.target.value
                                });
                            }}
                        />
                        <InputField
                            type="text"
                            label="Version"
                            placeholder="v0.1..."
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    version: e.target.value.trim()
                                })
                            }
                        />
                    </div>
                </section>
                <div className="pt-6 border-t border-gray-200">
                    <button className="submit-button"
                        type="button"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ContextForm;