import React from "react";

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
    value: T,
    disabled?: boolean,
    checkedMandatory?: boolean;
}

export type InputFieldProps<T extends string | number = string> = {
    label: string;
    error?: string;
    className?: string;
    value: T;
    onChange: (value: T) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;

export const InputField = <T extends string | number = string>(
    props: InputFieldProps<T>
) => {
    const {
        label,
        error,
        className,
        value,
        onChange,
        ...rest
    } = props;

    return (
        <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
            <label className="text-sm font-semibold text-gray-700">
                {label}
            </label>

            <input
                {...rest}
                value={value}
                onChange={(e) => onChange(e.target.value as T)}
                className={`
                    w-full px-4 py-2.5 rounded-lg border bg-white shadow-sm transition-all duration-200 ease-in-out
                    placeholder-gray-400 text-gray-900
                    focus:outline-none focus:ring-2 focus:ring-offset-1
                    disabled:bg-gray-100 disabled:text-gray-500
                    ${error
                        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-indigo-600 focus:ring-indigo-200 hover:border-gray-400"
                    }
                `}
            />

            {error && (
                <span className="text-xs text-red-600 font-medium animate-pulse mt-1 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    {error}
                </span>
            )}
        </div>
    );
};

// const NumericField = ({
//     title,
//     placeholder,
//     value,
//     onChange
// }: InputFieldProps<number>) => {
//     return (
//         <div>
//             <h1 className="block mb-2.5 text-sm font-medium text-heading"> {title} </h1>
//             <input
//                 className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-xl focus:ring-brand focus:border-brand block w-full px-2.5 py-2 shadow-xs placeholder:text-body"
//                 type="number"
//                 placeholder={placeholder}
//                 value={value ?? ""}
//                 onChange={(e) => {
//                     const raw = e.target.value;
//                     onChange(raw === "" ? NaN : Number(raw))
//                 }}
//             />
//         </div>
//     );
// }

// const TextAreaField = ({
//     title,
//     placeholder,
//     value,
//     onChange
// }: InputFieldProps) => {
//     return (
//         <div>
//             <form>
//                 <h1 className="block mb-2.5 text-sm font-medium text-heading">
//                     {title}
//                 </h1>
//                 <textarea
//                     id="message"
//                     className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-xl focus:ring-brand focus:border-brand block w-full p-3.5 shadow-xs placeholder:text-body"
//                     placeholder={placeholder}
//                     value={value ?? ""}
//                     onChange={(e) => onChange?(e.target.value)}
//                 />
//             </form>
//         </div>
//     );
// }

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
            {label && (
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    {label}
                </h3>
            )}

            {options.length === 0 ? (
                <span className="text-sm text-gray-500 italic">{placeholder}</span>
            ) : (
                <ul className="grid grid-cols-1 gap-2">
                    {options.map((opt) => {
                        const isSelected = value.includes(opt.value);
                        const isCheckedMandatory = opt.checkedMandatory ? opt.checkedMandatory : false;
                        return (
                            <li
                                key={String(opt.value)}
                                onClick={() => {
                                    if (!isCheckedMandatory) {
                                        handleToggle(opt.value)
                                    }
                                }}
                                className={`
                                    group flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 select-none
                                    ${opt.disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
                                    ${isSelected || isCheckedMandatory
                                        ? 'bg-indigo-50 border-indigo-600 shadow-sm'
                                        : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                                    }
                                `}
                            >
                                <div className={`
                                    flex items-center justify-center w-5 h-5 rounded border mr-3 transition-colors
                                    ${isSelected || isCheckedMandatory
                                        ? 'bg-indigo-600 border-indigo-600'
                                        : 'bg-white border-gray-300 group-hover:border-indigo-400'
                                    }
                                `}>
                                    {isSelected || isCheckedMandatory && (
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>

                                <span className={`text-sm font-medium ${isSelected ? 'text-indigo-900' : 'text-gray-700'}`}>
                                    {opt.label}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export {
    MultiSelectField,
    //NumericField,
    //TextAreaField,
    SelectField
}