import React from 'react';

interface ErrorMessageProps {
    message: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    if (!message) return null;
    return <p className="mt-4 text-red-400">{message}</p>;
};

export default ErrorMessage;
