import React from 'react';
import Checkbox from '../atoms/Checkbox';

interface ForkToggleProps {
    checked: boolean;
    onChange: () => void;
}

const ForkToggle: React.FC<ForkToggleProps> = ({ checked, onChange }) => (
    <Checkbox checked={checked} onChange={onChange} label="Hide Forked Repositories" />
);

export default ForkToggle;
