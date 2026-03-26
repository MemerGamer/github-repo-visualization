import React from 'react';

interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary', disabled, className }) => {
    const base = 'px-4 py-2 rounded-lg font-medium transition-colors';
    const variants = {
        primary: 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50',
        secondary: 'bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:opacity-50',
    };
    return (
        <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className ?? ''}`}>
            {children}
        </button>
    );
};

export default Button;
