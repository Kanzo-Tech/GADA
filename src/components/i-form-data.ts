export type ManagingEntity = {
    name: string,
    taxId: string,
    address: string,
    legalRepresentative: string
}

export type DataSpace = {
    name: string,
    sector: string,
    geographicScope: string,
    scopeAndPurpose: string
}

export type TechnicalAuthority = {
    legalName: string,
    taxId: string,
    governanceRole: string,
    contact: string,
    geographicScope: string,
}

export interface IFormData {
    managingEntity: ManagingEntity;
    dataSpace: DataSpace;
    technicalAuthority: TechnicalAuthority;
    numberOfParticipants?: number;
    participantType: string;
    version: string;
    date: string; //Este campo es un string por facilidad, pero se puede cambiar a una fecha (Date) en el futuro - V0.1
}

