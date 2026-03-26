import React from 'react';

interface ColorDotProps {
    color: string;
}

const ColorDot: React.FC<ColorDotProps> = ({ color }) => (
    <span className="inline-block w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
);

export default ColorDot;
