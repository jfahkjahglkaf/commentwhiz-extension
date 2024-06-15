import React from "react";
export function Button({ onClick, text, className, disabled }) {
    // Conditional class addition based on the disabled prop
    const disabledClasses = disabled ? "grayscale cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400" : "hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300";
    
    return (
        <button
            className={`relative px-4 py-2 text-sm font-medium bg-custom-blue text-white border-2 rounded-lg transition ${className}`}
            onClick={onClick}
            //disabled={disabled}
        >
            {text}
        </button>
    );
}