
import React from 'react';
import type { AppStatus } from '../types';
import { LoadingSpinner, AlertTriangleIcon } from './icons';

interface ResultDisplayProps {
    status: AppStatus;
    response: string;
    errorMessage: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ status, response, errorMessage }) => {
    if (status === 'processing') {
        return (
            <div className="w-full bg-gray-800 border border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-lg">
                <LoadingSpinner className="w-10 h-10 text-cyan-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-300">Analyzing Document...</h3>
                <p className="text-sm text-gray-500">Please wait while the AI processes your query.</p>
            </div>
        );
    }
    
    if (status === 'error' && errorMessage) {
         return (
            <div className="w-full bg-red-900/20 border border-red-500/50 rounded-2xl p-6 flex items-start text-red-300 shadow-lg">
                <AlertTriangleIcon className="w-6 h-6 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-bold">An Error Occurred</h3>
                  <p className="text-sm">{errorMessage}</p>
                </div>
            </div>
        );
    }

    if (status === 'success' && response) {
        return (
            <div className="w-full bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-lg">
                <h2 className="text-xl font-bold text-cyan-400 mb-4">Response</h2>
                <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {response}
                </div>
            </div>
        );
    }

    return null;
};
