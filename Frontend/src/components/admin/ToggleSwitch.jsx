// src/components/admin/ToggleSwitch.jsx
import { useState } from 'react';

// 'initialState' prop determines if the toggle is on or off by default.
// 'onChange' is a function that can be called when the state changes.
const ToggleSwitch = ({ initialState = false, onChange }) => {
    const [isOn, setIsOn] = useState(initialState);

    const handleToggle = () => {
        const newState = !isOn;
        setIsOn(newState);
        if (onChange) {
            onChange(newState); // Notify parent component of the change
        }
    };

    return (
        <button
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                isOn ? 'bg-teal-500' : 'bg-gray-200'
            }`}
        >
            <span className="sr-only">Use setting</span>
            <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isOn ? 'translate-x-5' : 'translate-x-0'
                }`}
            />
        </button>
    );
};

export default ToggleSwitch;