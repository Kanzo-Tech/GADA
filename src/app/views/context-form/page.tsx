"use client";

import { InputField, NumericField } from "@/components/form-fields";
import { use, useState } from "react";
import '../../styles/context-layout.css';

function ContextForm() {
    const [managingEntityName, setManagingEntityName] = useState<String>();
    // const [dataSpaceSector, setDataSpaceSector] = useState<String>();
    const [taxId, setTaxId] = useState<String>();
    const [address, setAddress] = useState<String>();
    const [legalRepresentative, setLegalRepresentative] = useState<String>();
    // const [scopeAndPurpose, setScopeAndPurpose] = useState<String>();

    const [dataSpaceName, setDataSpaceName] = useState<String>();
    const [dataSpaceSector, setDataSpaceSector] = useState<String>();
    const [scopeAndPurpose, setScopeAndPurpose] = useState<String>();
    const [geographicScope, setGeographicScope] = useState<String>();
    const [participantType, setParticipantType] = useState<String>();
    const [numberOfParticipants, setNumberOfParticipants] = useState<BigInt>();

    const [technicalAuthorityLegalName, setTechnicalAuthorityLegalName] = useState<String>();
    const [technicalAuthorityId, setTechnicalAuthorityId] = useState<String>();
    const [technicalAuthorityGovernanceRole, setTechnicalAuthorityGovernanceRole] = useState<String>();
    // const [technicalAutorhityGeographicScope, setTechnicalAutorhityGeographicScope] = useState<String>();
    const [technicalAuthorityContact, setTechnicalAuthorityContact] = useState<String>();

    return (
        <div>
            <div className="ml-4 mt-4 max-w text-start">
                <h1 className="text-4xl font-bold text-slate-900">Provide a formal context to your dataspace</h1>
                <p className="text-gray-500 text-lg">Fill the form with the most basic metadata that describe your dataspace</p>
            </div>
            <div className="grid grid-cols-2 grid-flow-row min-h-screen border rounded-2xl border-gray-500 m-5 p-10">
                <div className="context-form">
                    <h2 className="text-2xl mb-4">Managing entity</h2>
                    <form className="max-w-sm mx-auto space-y-4 grid grid-cols-2 gap-2">
                        <InputField
                            title="Name"
                            placeholder="Name..."
                            onChange={setManagingEntityName}
                        />
                        <InputField
                            title="Tax ID"
                            placeholder="Tax id..."
                            onChange={setTaxId}
                        />
                        <InputField
                            title="Address"
                            placeholder="Address..."
                            onChange={setAddress}
                        />
                        <InputField
                            title="Legal representative"
                            placeholder="Legal representative..."
                            onChange={setLegalRepresentative}
                        />
                    </form>
                    <h2 className="text-2xl mb-4">Data Space information</h2>
                    <form className="max-w-sm mx-auto space-y-4 grid grid-cols-2 gap-2">
                        <InputField
                            title="Name"
                            placeholder="Data space name..."
                            onChange={setDataSpaceName}
                        />
                        <InputField
                            title="Sector"
                            placeholder="Sector..."
                            onChange={setDataSpaceSector}
                        />
                        <InputField
                            title="Scope and purpose"
                            placeholder="Scope and purpose..."
                            onChange={setScopeAndPurpose}
                        />
                        <InputField
                            title="Geographic scope"
                            placeholder="Geographic scope..."
                            onChange={setGeographicScope}
                        />
                        <NumericField
                            title="Number of participants"
                            placeholder="Number of participants..."
                            onChange={setNumberOfParticipants}
                        />
                        <InputField
                            title="Participant type"
                            placeholder="Participant type..."
                            onChange={setParticipantType}
                        />
                    </form>
                    <h2 className="text-2xl mb-4">Technical authority</h2>
                    <form className="max-w-sm mx-auto space-y-4 grid grid-cols-2 gap-2 divide divide-dotted">
                        <InputField
                            title="Legal name"
                            placeholder="Legal name..."
                            onChange={setTechnicalAuthorityLegalName}
                        />
                        <InputField
                            title="Tax Id"
                            placeholder="Tax Id..."
                            onChange={setTechnicalAuthorityId}
                        />
                        <InputField
                            title="Governance role"
                            placeholder="Role..."
                            onChange={setTechnicalAuthorityGovernanceRole}
                        />
                        <InputField
                            title="Contact information"
                            placeholder="contact@information.com"
                            onChange={setTechnicalAuthorityContact}
                        />
                        <p> Checkbox </p>
                    </form>

                </div>
            </div>
        </div >
    );
}

export default ContextForm;