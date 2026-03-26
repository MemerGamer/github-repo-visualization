import React from 'react';
import Select from '../atoms/Select';

const LAYOUT_OPTIONS = [
    { value: 'grid', label: 'Grid' },
    { value: 'cose', label: 'Cose' },
    { value: 'breadthfirst', label: 'Breadthfirst' },
    { value: 'concentric', label: 'Concentric' },
    { value: 'circle', label: 'Circle' },
];

interface LayoutSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

const LayoutSelector: React.FC<LayoutSelectorProps> = ({ value, onChange }) => (
    <div className="flex items-center gap-2">
        <h1 className="text-white text-lg p-2">Graph Layout:</h1>
        <Select
            title="layout-select"
            value={value}
            onChange={onChange}
            options={LAYOUT_OPTIONS}
        />
    </div>
);

export default LayoutSelector;
