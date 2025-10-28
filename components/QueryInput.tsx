
import React from 'react';
import { SearchIcon } from './icons';

interface QueryInputProps {
    query: string;
    onQueryChange: (query: string) => void;
    onSubmit: () => void;
    disabled: boolean;
}

export const QueryInput: React.FC<QueryInputProps> = ({ query, onQueryChange, onSubmit, disabled }) => {

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if(!disabled) onSubmit();
        }
    };

    return (
        <div className="relative">
            <textarea
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., 'What are the key findings in section 3?'"
                disabled={disabled}
                rows={3}
                className="w-full resize-none rounded-lg bg-gray-700 border border-gray-600 p-4 pr-28 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow disabled:opacity-50"
            />
            <button
                onClick={onSubmit}
                disabled={disabled}
                className="absolute top-1/2 -translate-y-1/2 right-4 flex items-center gap-2 rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <SearchIcon className="w-4 h-4" />
                <span>Ask</span>
            </button>
        </div>
    );
};
