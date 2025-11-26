import React from "react";

interface InputFieldProps<T = string> {
    title: string,
    placeholder?: string,
    value?: string | undefined,
    onChange: (newValue: T) => void
}

// Props de multiselect
interface MultiSelectProps<T = string> {
    label?: string,
    options: SelectOption<T>[];
    value: T[];
    placeholder?: string;
    disabled?: boolean;
    onChange: (newValue: T[]) => void;
}

interface SelectProps<T = string> {
    label?: string,
    options: SelectOption<string>[],
    placeholder?: string,
    value?: T,
    onChange: (newValue: T) => void;
}

// Tipo genérico para las opciones
export interface SelectOption<T = string> {
    label: string,
    value: T
}

const InputField = <T extends string | number = string>({
    title,
    placeholder,
    value,
    onChange

}: InputFieldProps<T>) => {
    return (
        <div>
            <h1 className="block mb-2.5 text-sm font-medium text-heading">
                {title}
            </h1>
            <input
                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-xl focus:ring-brand focus:border-brand block w-full px-2.5 py-2 shadow-xs placeholder:text-body"
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value as T)}
            />
        </div>
    );
}

const NumericField = ({
    title,
    placeholder,
    value,
    onChange
}: InputFieldProps<number>) => {
    return (
        <div>
            <h1 className="block mb-2.5 text-sm font-medium text-heading"> {title} </h1>
            <input
                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-xl focus:ring-brand focus:border-brand block w-full px-2.5 py-2 shadow-xs placeholder:text-body"
                type="number"
                placeholder={placeholder}
                value={value ?? ""}
                onChange={(e) => {
                    const raw = e.target.value;
                    onChange(raw === "" ? NaN : Number(raw))
                }}
            />
        </div>
    );
}

const TextAreaField = ({
    title,
    placeholder,
    value,
    onChange
}: InputFieldProps) => {
    return (
        <div>
            <form>
                <h1 className="block mb-2.5 text-sm font-medium text-heading">
                    {title}
                </h1>
                <textarea
                    id="message"
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-xl focus:ring-brand focus:border-brand block w-full p-3.5 shadow-xs placeholder:text-body"
                    placeholder={placeholder}
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                />
            </form>
        </div>
    );
}

function SelectField<T = string>({
    label,
    options,
    placeholder,
    value,
    onChange
}: SelectProps<T>) {

    const stringValue = String(value ?? "");

    return (
        <div className="flex flex-col gap-2">
            <form>
                <h1 className="block mb-2.5 text-sm font-medium text-heading"> {label} </h1>
                <select
                    className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-xl focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                    value={stringValue}
                    onChange={(e) => {
                        if (!onChange) return;
                        const raw = e.target.value;

                        onChange(raw as unknown as T);

                    }}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((opt) => (
                        <option key={String(opt.value)} value={String(opt.value)}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </form>
        </div>
    );
}

function MultiSelectField<T = string>({
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

export {
    InputField,
    MultiSelectField,
    NumericField,
    TextAreaField,
    SelectField
}