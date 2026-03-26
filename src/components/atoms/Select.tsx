import React from 'react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    title?: string;
    className?: string;
}

const Select: React.FC<SelectProps> = ({ value, onChange, options, title, className }) => (
    <select
        title={title}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`p-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 ${className ?? ''}`}
    >
        {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
    </select>
);

export default Select;
