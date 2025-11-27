

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
    participantType: string,
    numberOfParticipants?: number,
    scopeAndPurpose: string
}

export type TechnicalAuthority = {
    legalName: string,
    taxId: string,
    governanceRole: string,
    geographicScope: string,
    contact: string
}

export interface IFormData {
    managingEntity?: ManagingEntity;
    dataSpace?: DataSpace;
    technicalAuthority?: TechnicalAuthority;
    version?: string;
    date?: Date;
}