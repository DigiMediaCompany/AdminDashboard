import { useEffect, useState } from 'react'

interface ToggleButtonProps {
    checked?: boolean
    defaultChecked?: boolean
    onToggle?: (checked: boolean) => void
}

const ToggleButton = ({ checked, defaultChecked = false, onToggle }: ToggleButtonProps) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked)

    // Determine if controlled or uncontrolled
    const isControlled = checked !== undefined
    const isChecked = isControlled ? checked : internalChecked

    const handleCheckboxChange = () => {
        const newState = !isChecked
        if (!isControlled) setInternalChecked(newState)
        onToggle?.(newState)
    }

    useEffect(() => {
        if (isControlled) setInternalChecked(checked!)
    }, [checked, isControlled])

    return (
        <label className="flex cursor-pointer select-none items-center">
            <div className="relative">
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    className="sr-only"
                />

                {/* Background of the switch */}
                <div
                    className={`block h-8 w-14 rounded-full transition-colors duration-300 ${
                        isChecked
                            ? 'bg-primary dark:bg-brand-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                ></div>

                {/* Knob */}
                <div
                    className={`absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-gray-200 shadow-md transition-transform duration-300 ${
                        isChecked ? 'translate-x-6' : ''
                    }`}
                ></div>
            </div>
        </label>
    )
}

export default ToggleButton
