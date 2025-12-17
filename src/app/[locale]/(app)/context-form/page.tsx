"use client";

import { InputField } from "@/components/form-fields";
import { useEffect, useState } from "react";
import '../../styles/context-layout.css';
import '../../styles/globals.css';
import { navigation } from "@/components/redirecting";
import {
    IFormData,
    type DataSpace,
    type ManagingEntity,
    type TechnicalAuthority
} from "@/components/i-form-data";
import { mergeContextDraft, loadContextDraft, ContextDraft, addGeneratedConfigFromDraft, saveContextDraft } from "@/components/local-storage";
import { Amarante } from "next/font/google";

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

    const [dataSpace, setDataSpace] = useState<DataSpace>({
        name: "",
        sector: "",
        geographicScope: "",
        scopeAndPurpose: ""
    })

    const [version, setVersion] = useState<string>();
    const [numberOfParticipants, setNumberOfParticipants] = useState<number>();
    const [participantType, setParticipantType] = useState<string>();

    useEffect(() => {
        const draft = loadContextDraft();
        if (!draft) return;

        if (draft.managingEntity) setManagingEntity(draft.managingEntity);
        if (draft.dataSpace) setDataSpace(draft.dataSpace);
        if (draft.technicalAuthority) setTechnicalAuthority(draft.technicalAuthority);
    }, [])

    const { navigateTo } = navigation();

    const handleManagingChange =
        (field: keyof ManagingEntity, value: string) => {
            setManagingEntity((prev) => ({ ...prev, [field]: value }))
        };

    const handleDataSpaceChange =
        (field: keyof DataSpace, value: string) => {
            setDataSpace((prev) => ({ ...prev, [field]: value }))
        }

    const handleTechnicalChange =
        (field: keyof TechnicalAuthority, value: string) => {
            setTechnicalAuthority((prev) => ({ ...prev, [field]: value }));
        };

    const [errorTaxId, setErrorTaxId] = useState({ managingEntityTaxId: "", technicalAuthorityTaxId: "" });
    const validateTaxId = (formValue: string, type: 'managingEntityTaxId' | 'technicalAuthorityTaxId') => {
        if (!formValue) {
            setErrorTaxId(prev => ({ ...prev, [type]: "You can't leave this field empty" }));
        }

        const validCifRegex = /^[AB][0-9]{8}$/;
        const validNifNieRegex = /^[XYZ0-9][0-9]{7}[A-Z]$/;
        if (validCifRegex.test(formValue) || validNifNieRegex.test(formValue)) {
            setErrorTaxId(prev => ({ ...prev, [type]: "" }));
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
            setErrorMandatoryField(prev => ({ ...prev, [mandatoryField]: "" }))
        }
    };

    const [errorSimpleTextMandatory, setErrorSimpleTextMandatory] = useState({ dataSpaceSector: "", dataSpaceGeographicScope: "" })
    const validateSimpleTextMandatoryField = (formValue: string, type: 'dataSpaceSector' | 'dataSpaceGeographicScope') => {
        if (!formValue || formValue.trim() === '') {
            setErrorSimpleTextMandatory(prev => ({
                ...prev,
                [type]: "You can't leave this field blank, it's mandatory."
            }));
            return;
        }

        const simpleTextRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

        if (!simpleTextRegex.test(formValue)) {
            setErrorSimpleTextMandatory(prev => ({
                ...prev,
                [type]: "Invalid format, you may only enter letters and spaces."
            }));
            return;
        }

        setErrorSimpleTextMandatory(prev => ({ ...prev, [type]: "" }));
    };

    const [managingEqualsTechnicalChecked, setChecked] = useState(false);
    const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;

        if (isChecked) {
            const managingEntityName = managingEntity.name.trim();
            const managingEntityTaxId = managingEntity.taxId.trim();

            if (managingEntityName === '' || managingEntityTaxId === '') {
                if (managingEntityName === '') alert("Missing the required field name of the managing entity.");
                if (managingEntityTaxId === '') alert("Missing the required field tax id of the managing entity.");
                return;
            }
            if (errorTaxId.managingEntityTaxId != '') {
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
            setTechnicalAuthority((prev) => ({
                ...prev,
                ['legalName']: managingEntity.name,
                ['taxId']: managingEntity.taxId
            }))
        } else {
            setChecked(false);
        }
    }

    const checkForErrors = () => {
        var error = ""
        validateMandatoryField(managingEntity.name, "managingEntityName");
        validateMandatoryField(managingEntity.address, "managingEntityAddress");
        validateMandatoryField(managingEntity.legalRepresentative, "managingEntityLegalRepresentative");
        validateMandatoryField(dataSpace.name, "dataSpaceName");
        validateMandatoryField(dataSpace.scopeAndPurpose, "dataSpaceScopeAndPurpose");
        validateTaxId(managingEntity.taxId, "managingEntityTaxId");
        validateSimpleTextMandatoryField(dataSpace.sector, "dataSpaceSector");
        validateSimpleTextMandatoryField(dataSpace.geographicScope, "dataSpaceGeographicScope");
        if (!managingEqualsTechnicalChecked) {
            validateMandatoryField(technicalAuthority.legalName, "technicalAuthorityLegalName");
            validateTaxId(technicalAuthority.taxId, "technicalAuthorityTaxId");
        }
        if (errorBlankMandatoryField.managingEntityName != "" || errorBlankMandatoryField.managingEntityAddress != ""
            || errorBlankMandatoryField.managingEntityLegalRepresentative != "" || errorBlankMandatoryField.dataSpaceName != ""
            || errorBlankMandatoryField.dataSpaceScopeAndPurpose != "" || errorTaxId.managingEntityTaxId != "" || errorTaxId.technicalAuthorityTaxId != ""
            || errorTaxId.technicalAuthorityTaxId != "" || errorSimpleTextMandatory.dataSpaceSector != "" || errorSimpleTextMandatory.dataSpaceGeographicScope != ""
            || managingEntity.name === "" || managingEntity.address === "" || managingEntity.legalRepresentative === ""
            || dataSpace.name === "" || dataSpace.scopeAndPurpose === "" || managingEntity.taxId === ""
            || dataSpace.sector === "" || dataSpace.geographicScope === "" || technicalAuthority.legalName === ""
            || technicalAuthority.taxId === ""
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

        saveContextDraft({
            managingEntity: managingEntity,
            dataSpace: dataSpace,
            technicalAuthority: technicalAuthority,

            participantType: participantType,
            numberOfParticipants: numberOfParticipants,
            version: version,
            date: new Date()
        })




        // const finalFormData: IFormData = {
        //     ...formData,
        //     date: formattedDate
        // };
        const error = await checkForErrors(/*finalFormData*/);
        if (error != "") {
            alert(error);
            return;
        }


        ///!!! const response = await fetch('/api/document-generation', {
        ///!!!     method: 'POST',
        ///!!!     headers: {
        ///!!!         'Content-Type': 'application/json',
        ///!!!     },
        ///!!!     body: JSON.stringify(finalFormData),
        ///!!! });
        ///!!! if (response.ok) {
        ///!!!     navigateTo('/export');
        ///!!! } else {
        ///!!!     alert("The form has to be filled correctly. Check the errors to solve them before submitting.");
        ///!!!     return;
        ///!!! }
        navigateTo('/export');
    }


    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            <div className="max-w-4xl w-full text-start mb-8 ml-2">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Provide a formal context to your dataspace</h1>
                <p className="text-gray-500 text-lg mt-2">Fill the form with the most basic metadata that describe your dataspace</p>
            </div>

            <div className="max-w-4xl w-full bg-white border border-gray-200 rounded-2xl shadow-xl p-8 md:p-12 space-y-10">
                <section className="space-y-6">
                    <div className="title-div-context">
                        <h2 className="h2-style">Managing entity</h2>
                    </div>
                    <div className="context-form-inputs">
                        <InputField
                            type="text"
                            label="Name"
                            value={managingEntity.name}
                            minLength={3}
                            placeholder="Juan Teodomiro López Navarrete"
                            onBlur={() => {
                                setManagingEntity((prev) => ({
                                    ...prev,
                                    ['name']: managingEntity.name.trim()
                                }))
                                validateMandatoryField(managingEntity.name, 'managingEntityName');
                            }}
                            onChange={(newValue) => {
                                if (errorBlankMandatoryField.managingEntityName) {
                                    setErrorMandatoryField(prev => ({ ...prev, managingEntityName: "" }))
                                };
                                handleManagingChange("name", newValue);
                            }}

                            error={errorBlankMandatoryField.managingEntityName}
                        />
                        <InputField
                            type="text"
                            label="Tax id"
                            value={managingEntity.taxId}
                            maxLength={9}
                            placeholder="X1234567X"
                            onBlur={() => {
                                setManagingEntity((prev) => ({
                                    ...prev,
                                    ['taxId']: managingEntity.taxId.trim().toUpperCase()
                                }))
                                validateTaxId(managingEntity.taxId, 'managingEntityTaxId')
                            }}
                            onChange={(newValue) => {
                                if (errorTaxId.managingEntityTaxId) setErrorTaxId(prev => ({ ...prev, managingEntityTaxId: "" }));

                                handleManagingChange("taxId", newValue);
                            }}
                            error={errorTaxId.managingEntityTaxId}
                        />
                        <InputField
                            type="text"
                            label="Address"
                            value={managingEntity.address}
                            minLength={7}
                            placeholder="Avenida de Cervantes, 2, 29071 Malaga"
                            onBlur={() => {
                                setManagingEntity((prev) => ({
                                    ...prev,
                                    ['address']: managingEntity.address.trim()
                                }))
                                validateMandatoryField(managingEntity.address, 'managingEntityAddress');
                            }}
                            onChange={(newValue) => {
                                if (errorBlankMandatoryField.managingEntityAddress) setErrorMandatoryField(prev => ({ ...prev, managingEntityAddress: "" }));

                                handleManagingChange("address", newValue);
                            }}
                            error={errorBlankMandatoryField.managingEntityAddress}
                        />
                        <InputField
                            type="text"
                            label="Legal representative name"
                            value={managingEntity.legalRepresentative}
                            minLength={3}
                            placeholder="Tony Chopper..."
                            onBlur={() => {
                                setManagingEntity((prev) => ({
                                    ...prev,
                                    ['legalRepresentative']: managingEntity.legalRepresentative.trim()
                                }))
                                validateMandatoryField(managingEntity.legalRepresentative, 'managingEntityLegalRepresentative');
                            }}
                            onChange={(newValue) => {
                                if (errorBlankMandatoryField.managingEntityLegalRepresentative) setErrorMandatoryField(prev => ({ ...prev, managingEntityLegalRepresentative: "" }));

                                handleManagingChange("legalRepresentative", newValue);
                            }}
                            error={errorBlankMandatoryField.managingEntityLegalRepresentative}
                        />
                    </div>
                </section>
                <section className="checkbox-container-context">
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
                    <div className="title-div-context">
                        <h2 className="h2-style">Data Space information</h2>
                    </div>
                    <div className="context-form-inputs">
                        <InputField
                            type="text"
                            label="Name"
                            value={dataSpace.name}
                            placeholder="Malaga University..."
                            onBlur={() => {
                                setDataSpace((prev) => ({
                                    ...prev,
                                    ['name']: dataSpace.name.trim()
                                }))
                                validateMandatoryField(dataSpace.name, 'dataSpaceName');
                            }}
                            onChange={(newValue) => {
                                if (errorBlankMandatoryField.dataSpaceName) setErrorMandatoryField(prev => ({ ...prev, dataSpaceName: "" }));
                                handleDataSpaceChange("name", newValue);
                            }}
                            error={errorBlankMandatoryField.dataSpaceName}
                        />
                        <InputField
                            type="text"
                            label="Sector"
                            value={dataSpace.sector}
                            placeholder="Education..."
                            onBlur={() => {
                                setDataSpace((prev) => ({
                                    ...prev,
                                    ['sector']: dataSpace.sector.trim()
                                }))
                                validateSimpleTextMandatoryField(dataSpace.sector, 'dataSpaceSector');
                            }}
                            onChange={(newValue) => {
                                if (errorSimpleTextMandatory.dataSpaceSector) setErrorSimpleTextMandatory(prev => ({ ...prev, dataSpaceSector: "" }));

                                handleDataSpaceChange("sector", newValue);
                            }}
                            error={errorSimpleTextMandatory.dataSpaceSector}
                        />
                        <InputField
                            type="text"
                            minLength={10}
                            label="Scope and purpose"
                            value={dataSpace.scopeAndPurpose}
                            placeholder="Educational usage for Malaga University..."
                            onBlur={() => {
                                setDataSpace((prev) => ({
                                    ...prev,
                                    ['scopeAndPurpose']: dataSpace.scopeAndPurpose.trim()
                                }))
                                validateMandatoryField(dataSpace.scopeAndPurpose, 'dataSpaceScopeAndPurpose');
                            }}
                            onChange={(newValue) => {
                                if (errorBlankMandatoryField.dataSpaceScopeAndPurpose) setErrorMandatoryField(prev => ({ ...prev, dataSpaceScopeAndPurpose: "" }));

                                handleDataSpaceChange("scopeAndPurpose", newValue);
                            }}
                            error={errorBlankMandatoryField.dataSpaceScopeAndPurpose}
                        />
                        <InputField
                            type="text"
                            label="Geographic scope"
                            value={dataSpace.geographicScope}
                            placeholder="Málaga..."
                            onBlur={() => {
                                setDataSpace((prev) => ({
                                    ...prev,
                                    ['geographicScope']: dataSpace.geographicScope.trim()
                                }))
                                validateSimpleTextMandatoryField(dataSpace.geographicScope, 'dataSpaceGeographicScope');
                            }}
                            onChange={(newValue) => {
                                if (errorSimpleTextMandatory.dataSpaceGeographicScope) setErrorSimpleTextMandatory(prev => ({ ...prev, dataSpaceGeographicScope: "" }));

                                handleDataSpaceChange("geographicScope", newValue);
                            }}
                            error={errorSimpleTextMandatory.dataSpaceGeographicScope}
                        />
                    </div>
                </section>
                <section className="space-y-6">
                    <div className="title-div-context">
                        <h2 className="h2-style">Technical authority</h2>
                    </div>
                    <div className="context-form-inputs">
                        <InputField
                            type="text"
                            label="Legal name"
                            value={technicalAuthority.legalName}
                            placeholder="Ekko Roger..."
                            disabled={managingEqualsTechnicalChecked}
                            onBlur={() => {
                                setTechnicalAuthority((prev) => ({
                                    ...prev,
                                    ['legalName']: technicalAuthority.legalName.trim()
                                }))
                                validateMandatoryField(technicalAuthority.legalName, "technicalAuthorityLegalName");
                            }}
                            onChange={(newValue) => {
                                if (errorBlankMandatoryField.technicalAuthorityLegalName) setErrorMandatoryField(prev => ({ ...prev, technicalAuthorityLegalName: "" }));

                                handleTechnicalChange("legalName", newValue);
                            }}
                            error={errorBlankMandatoryField.technicalAuthorityLegalName}
                        />
                        <InputField
                            type="text"
                            label="Tax Id"
                            value={technicalAuthority.taxId}
                            placeholder="Tax Id..."
                            disabled={managingEqualsTechnicalChecked}
                            onBlur={() => {
                                setTechnicalAuthority((prev) => ({
                                    ...prev,
                                    ['taxId']: technicalAuthority.taxId.trim().toUpperCase()
                                }))
                                validateTaxId(technicalAuthority.taxId, "technicalAuthorityTaxId")
                            }}
                            onChange={(newValue) => {
                                if (errorTaxId.technicalAuthorityTaxId) setErrorTaxId(prev => ({ ...prev, technicalAuthorityTaxId: '' }));

                                handleTechnicalChange("taxId", newValue);
                            }}
                            error={errorTaxId.technicalAuthorityTaxId}
                        />
                        <InputField
                            type="text"
                            label="Governance role"
                            value={technicalAuthority.governanceRole}
                            placeholder="Administrator..."
                            onChange={(newValue) => {
                                handleTechnicalChange("governanceRole", newValue);
                            }}
                        />
                        <InputField
                            type="email"
                            label="Contact information"
                            value={technicalAuthority.contact}
                            placeholder="contact@information.com"
                            onBlur={() => {
                                setTechnicalAuthority((prev) => ({
                                    ...prev,
                                    ['contact']: technicalAuthority.contact.trim()
                                }))
                            }}
                            onChange={(newValue) => {
                                handleTechnicalChange("contact", newValue)
                            }}
                        />
                        <InputField
                            type="text"
                            label="Geographic scope"
                            value={technicalAuthority.geographicScope}
                            placeholder="Málaga..."
                            onBlur={() => {
                                setTechnicalAuthority((prev) => ({
                                    ...prev,
                                    ['geographicScope']: technicalAuthority.geographicScope.trim()
                                }))
                            }}
                            onChange={(newValue) => {
                                handleTechnicalChange("geographicScope", newValue)
                            }}
                        />
                    </div>
                </section>
                <section className="space-y-6">
                    <div className="title-div-context"></div>
                    <div className="context-form-inputs">
                        <InputField
                            type="number"
                            label="Number of participants"
                            value={numberOfParticipants}
                            placeholder="100"
                            onChange={(newValue) => {
                                setNumberOfParticipants(newValue)
                                mergeContextDraft({
                                    numberOfParticipants: numberOfParticipants
                                })
                            }}
                        />
                        <InputField
                            type="text"
                            label="Participants type"
                            value={participantType}
                            placeholder="Students and teachers..."
                            onBlur={() => {
                                setParticipantType(participantType?.trim())
                                mergeContextDraft({
                                    participantType: participantType
                                })
                            }}
                            onChange={(newValue) => {
                                setParticipantType(newValue)
                            }}
                        />
                        <InputField
                            type="text"
                            label="Version"
                            value={version}
                            placeholder="v0.1..."
                            onChange={(newValue) => {
                                setVersion(newValue.trim())
                                mergeContextDraft({
                                    version: version
                                })
                            }}
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