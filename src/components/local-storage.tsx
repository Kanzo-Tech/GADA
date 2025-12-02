import { DataSpace, IFormData, ManagingEntity, TechnicalAuthority } from "./i-form-data";

/** LOCAL STORAGE IMPLEMENTATION */
const STORAGE_KEY = "gada-context-draft";

type SerializableDraft = Omit<IFormData, "date"> & { date?: string }

export function loadContextDraft(): ContextDraft | null {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw) as SerializableDraft;
        return {
            ...parsed,
            date: parsed.date ? new Date(parsed.date) : undefined,
        };
    } catch {
        return null;
    }
}

/**
 * Guarda context draft en memoria
 * @param draft 
 * @returns 
 */
export function saveContextDraft(draft: ContextDraft) {
    if (typeof window === "undefined") return;
    const serializable: SerializableDraft = {
        ...draft,
        date: draft.date ? draft.date.toISOString() : undefined,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
}

/**
 * Una context draft de memoria con context draft parcial
 * @param partial Context draft parcial para unir a context draft en memoria
 * @returns Resultado de la unión de ambos context draft
 */
export function mergeContextDraft(partial: Partial<ContextDraft>): ContextDraft {
    const existing = loadContextDraft() ?? {};
    const merged: ContextDraft = {
        ...existing,
        ...partial
    }
    return merged;
}

export function clearContextDraft() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
}

// ---- Completed configurations

/**
 * Configuración parcial, no completa
 * Se utiliza como eedd para guardar las respuestas de los formularios en tiempo real
 */
export interface ContextDraft {
    managingEntity?: ManagingEntity;
    dataSpace?: DataSpace;
    technicalAuthority?: TechnicalAuthority;

    numberOfParticipants?: number;
    participantType?: string;
    version?: string;
    date?: Date;
    docTypes?: string[];
    outputFormats?: string[];
    alignedRegulations?: string[];
}

/**
 * Configuración completa
 * Esto es lo que se ve en la vista SUMMARY
 */
export interface GeneratedConfig {
    id: string,
    version: string,
    date: Date,
    numberOfParticipants?: number,
    participantType?: string,
    docTypes: string[],               //export      
    outputFormats: string[],          //export        
    allignedRegulations: string[],    //export            


    managingEntity: ManagingEntity,
    dataSpace: DataSpace,
    technicalAuthority: TechnicalAuthority;
}

const GENERATED_STORED_KEY = "gada-generated-configs";

type SerializableGenerated = Omit<GeneratedConfig, "date"> & { date: string };

/**
 * Carga la configuración (todas las respuestas de los formularios hasta el momento)
 * desde memoria
 * @returns Config de memoria
 */
export function loadGeneratedConfigs(): GeneratedConfig[] {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(GENERATED_STORED_KEY);
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw) as SerializableGenerated[];
        return parsed.map((c) => ({ ...c, date: new Date(c.date) }));
    } catch {
        return [];
    }
}

/**
 * Guarda en memoria una configuracion actualizada
 * @param configs Configuracion actualizada
 * @returns void
 */
export function saveGeneratedConfigs(configs: GeneratedConfig[]) {
    if (typeof window === "undefined") return;
    const serializable: SerializableGenerated[] = configs.map((c) => ({
        ...c,
        date: c.date.toISOString(),
    }))
    window.localStorage.setItem(
        GENERATED_STORED_KEY,
        JSON.stringify(serializable)
    )
}

/**
 * Añade context draft a configuración y la guarda en memoria
 * @param draft Información nueva que se añade
 * @returns Configuracion actualizada
 */
export function addGeneratedConfigFromDraft(
    draft: ContextDraft
): GeneratedConfig | null {
    if (
        !draft.version ||
        !draft.date ||
        !draft.managingEntity ||
        !draft.dataSpace ||
        !draft.technicalAuthority
    ) {
        return null;
    }

    const all = loadGeneratedConfigs();

    const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : Date.now().toString();

    const cfg: GeneratedConfig = {
        id,
        version: draft.version,
        date: draft.date,
        docTypes: draft.docTypes ?? [],
        outputFormats: draft.outputFormats ?? [],
        allignedRegulations: draft.alignedRegulations ?? [],
        managingEntity: draft.managingEntity,
        dataSpace: draft.dataSpace,
        technicalAuthority: draft.technicalAuthority
    }

    const updated = [...all, cfg]
    saveGeneratedConfigs(updated)
    return cfg;

}

/**
 * Elimina elemento concreto de memoria por id.
 * Funcionalidad para botón delete.
 * @param id 
 */
export function removeGeneratedConfig(
    id: string
) {
    const all = loadGeneratedConfigs();
    const filtered = all.filter((c) => c.id !== id);
    saveGeneratedConfigs(filtered);
}