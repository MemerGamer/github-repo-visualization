import React from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onSearch }) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') onSearch();
    };

    return (
        <div className="flex items-center gap-2">
            <h1 className="text-white text-lg p-2">GitHub Username:</h1>
            <Input
                value={value}
                onChange={onChange}
                placeholder="Enter GitHub username"
                onKeyDown={handleKeyDown}
            />
            <Button onClick={onSearch}>Search</Button>
        </div>
    );
};

export default SearchInput;
