import React from 'react';
import Checkbox from '../atoms/Checkbox';

interface LanguageFilterItemProps {
    language: string;
    checked: boolean;
    onChange: () => void;
}

const LanguageFilterItem: React.FC<LanguageFilterItemProps> = ({ language, checked, onChange }) => (
    <li>
        <Checkbox checked={checked} onChange={onChange} label={language} />
    </li>
);

export default LanguageFilterItem;
