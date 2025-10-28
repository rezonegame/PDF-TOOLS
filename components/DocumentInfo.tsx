
import React from 'react';
import { FileIcon, LoadingSpinner, XCircleIcon, AlertTriangleIcon } from './icons';

interface DocumentInfoProps {
    fileName: string;
    pageCount: number;
    isParsing: boolean;
    parsingError: string | null;
    onReset: () => void;
}

export const DocumentInfo: React.FC<DocumentInfoProps> = ({ fileName, pageCount, isParsing, parsingError, onReset }) => {
    return (
        <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center gap-4 overflow-hidden">
                <FileIcon className="w-8 h-8 text-cyan-400 flex-shrink-0" />
                <div className="overflow-hidden">
                    <p className="text-sm font-medium text-gray-200 truncate">{fileName}</p>
                    {isParsing && (
                        <div className="flex items-center text-xs text-yellow-400 gap-1">
                            <LoadingSpinner className="w-3 h-3" />
                            <span>Parsing document...</span>
                        </div>
                    )}
                    {parsingError && (
                        <div className="flex items-center text-xs text-red-400 gap-1">
                            <AlertTriangleIcon className="w-3 h-3" />
                            <span>Parsing Failed</span>
                        </div>
                    )}
                    {!isParsing && !parsingError && pageCount > 0 && (
                        <p className="text-xs text-gray-400">{pageCount} pages processed</p>
                    )}
                </div>
            </div>
            <button
                onClick={onReset}
                className="text-gray-500 hover:text-red-400 transition-colors ml-4 flex-shrink-0"
                aria-label="Remove document"
            >
                <XCircleIcon className="w-6 h-6" />
            </button>
        </div>
    );
};
