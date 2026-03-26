import React from 'react';
import ColorDot from '../atoms/ColorDot';

interface LanguageItemProps {
    language: string;
    color: string;
    count: number;
}

const LanguageItem: React.FC<LanguageItemProps> = ({ language, color, count }) => (
    <li className="flex items-center gap-2 py-0.5" style={{ color }}>
        <ColorDot color={color} />
        {language} ({count})
    </li>
);

export default LanguageItem;
