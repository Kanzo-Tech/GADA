import React from "react";

interface InputFieldProps<T = string> {
    title: string,
    placeholder?: string,
    value?: string,
    onChange: (newValue: T) => void
}

// Tipo genérico para las opciones
export interface MultiSelectOption<T = string> {
    label: string,
    value: T
}

// Props de multiselect
interface MultiSelectProps<T = string> {
    label?: string,
    options: MultiSelectOption<T>[];
    value: T[];
    onChange: (newValue: T[]) => void;
    placeholder?: string;
    disabled?: boolean;
}

export const InputField = ({ title, placeholder }: InputFieldProps) => {
    return (
        <div>
            <h1 className="text-xl font-medium"> {title} </h1>
            <input className="border border-slate-800 rounded" type="text" placeholder={placeholder} />
        </div>
    );
}

export function MultiSelectField<T = string>({
    label,
    options,
    value,
    onChange,
    placeholder = "Selecciona opciones...",
    disabled = false,
}: MultiSelectProps<T>) {
    const handleToggle = (optionValue: T) => {
        if (value.includes(optionValue)) {
            //quitar
            onChange(value.filter(v => v !== optionValue));
        } else {
            //añadir
            onChange([...value, optionValue])
        }
    }

    return (
        <div className="flex flex-col gap-2">
            {label && <span className="text-xl font-medium">{label}</span>}

            {options.length === 0 ? (
                <span className="text-sm text-gray-500">{placeholder}</span>
            ) : (
                <ul className="flex flex-col gap-1">
                    {options.map((opt) =>
                        <li key={String(opt.value)} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                disabled={disabled}
                                checked={value.includes(opt.value)}
                                onChange={() => handleToggle(opt.value)}
                            />
                            <span className={disabled ? "text-gray-400" : ""}>
                                {opt.label}
                            </span>
                        </li>
                    )}
                </ul>
            )
            }
        </div>
    );
}