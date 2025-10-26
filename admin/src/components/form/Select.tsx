import { useEffect, useMemo, useState } from "react";

export interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    options: Option[];
    placeholder?: string;
    onChange: (value: string | null) => void; // allow null
    className?: string;
    defaultValue?: string | null;
    disabled?: boolean;
    value?: string | null;
}

const Select: React.FC<SelectProps> = ({
                                           options,
                                           placeholder = "Select an option",
                                           onChange,
                                           className = "",
                                           defaultValue = null,
                                           disabled = false,
                                           value,
                                       }) => {
    // Controlled vs Uncontrolled
    const isControlled = value !== undefined;

    // Uncontrolled internal state (legacy usage)
    const [internalValue, setInternalValue] = useState<string | null>(defaultValue);

    // Keep internal state in sync if defaultValue changes (uncontrolled only)
    useEffect(() => {
        if (!isControlled) {
            setInternalValue(defaultValue ?? null);
        }
    }, [defaultValue, isControlled]);

    // Current value fed to <select>
    const currentValue = isControlled ? value ?? "" : internalValue ?? "";

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const next = e.target.value === "" ? null : e.target.value;
        if (!isControlled) setInternalValue(next);
        onChange(next);
    };

    // Compute style based on whether a value is set
    const hasValue = currentValue !== "";
    const computedClass = useMemo(
        () =>
            `h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                hasValue
                    ? "text-gray-800 dark:text-white/90"
                    : "text-gray-400 dark:text-gray-400"
            } ${className}`,
        [hasValue, className]
    );

    return (
        <select
            className={computedClass}
            value={currentValue}
            onChange={handleChange}
            disabled={disabled}
        >
            {/* Placeholder option */}
            <option
                value=""
                className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
            >
                {placeholder}
            </option>

            {/* Options */}
            {options.map((option) => (
                <option
                    key={option.value}
                    value={option.value}
                    className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                >
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default Select;
