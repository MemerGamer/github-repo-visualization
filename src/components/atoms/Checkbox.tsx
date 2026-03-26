import React from 'react';

interface CheckboxProps {
    checked: boolean;
    onChange: () => void;
    label: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label }) => (
    <label className="flex items-center gap-1 cursor-pointer">
        <input type="checkbox" checked={checked} onChange={onChange} />
        {label}
    </label>
);

export default Checkbox;
