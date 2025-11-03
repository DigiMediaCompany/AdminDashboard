import { useState } from 'react'

interface ToggleButtonProps {
    defaultChecked?: boolean
    onToggle?: (checked: boolean) => void
}

const ToggleButton = ({ defaultChecked = false, onToggle }: ToggleButtonProps) => {
    const [isChecked, setIsChecked] = useState(defaultChecked)

    const handleCheckboxChange = () => {
        const newState = !isChecked
        setIsChecked(newState)
        onToggle?.(newState)
    }

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
