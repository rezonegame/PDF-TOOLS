
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { PdfUpload } from './components/PdfUpload';
import { QueryInput } from './components/QueryInput';
import { ResultDisplay } from './components/ResultDisplay';
import { DocumentInfo } from './components/DocumentInfo';
import { usePdfProcessor } from './hooks/usePdfProcessor';
import { queryPdfContent } from './services/geminiService';
import type { AppStatus } from './types';
import { Footer } from './components/Footer';

const App: React.FC = () => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [query, setQuery] = useState<string>('');
    const [response, setResponse] = useState<string>('');
    const [status, setStatus] = useState<AppStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const { 
        text: pdfText, 
        isParsing, 
        error: parsingError, 
        pageCount,
        reset: resetPdfProcessor
    } = usePdfProcessor(pdfFile);

    useEffect(() => {
        if (parsingError) {
            setStatus('error');
            setErrorMessage(`Error parsing PDF: ${parsingError}`);
        }
    }, [parsingError]);

    const handleFileChange = (file: File | null) => {
        if (file) {
            if (file.type !== 'application/pdf') {
                setStatus('error');
                setErrorMessage('Invalid file type. Please upload a PDF.');
                return;
            }
            setPdfFile(file);
            setResponse('');
            setQuery('');
            setErrorMessage('');
            setStatus('idle');
        }
    };

    const handleReset = () => {
        setPdfFile(null);
        setResponse('');
        setQuery('');
        setErrorMessage('');
        setStatus('idle');
        resetPdfProcessor();
    };

    const handleSubmitQuery = useCallback(async () => {
        if (!query.trim() || !pdfText) {
            setErrorMessage(pdfText ? 'Please enter a question.' : 'Please upload and process a PDF first.');
            setStatus('error');
            return;
        }

        setStatus('processing');
        setResponse('');
        setErrorMessage('');

        try {
            const result = await queryPdfContent(pdfText, query);
            setResponse(result);
            setStatus('success');
        } catch (error) {
            console.error('Gemini API error:', error);
            setResponse('');
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred.');
        }
    }, [query, pdfText]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col font-sans">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
                <div className="w-full max-w-4xl space-y-8">
                    {!pdfFile ? (
                        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl transition-all duration-300 hover:shadow-cyan-500/20">
                           <h2 className="text-2xl font-bold text-center text-cyan-400 mb-2">Upload Your PDF</h2>
                           <p className="text-center text-gray-400 mb-6">Start by selecting a PDF document to analyze.</p>
                           <PdfUpload onFileChange={handleFileChange} disabled={isParsing} />
                        </div>
                    ) : (
                        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
                             <DocumentInfo 
                                fileName={pdfFile.name} 
                                pageCount={pageCount} 
                                isParsing={isParsing}
                                parsingError={parsingError}
                                onReset={handleReset}
                            />

                            {pdfText && !isParsing && (
                                <>
                                <div className="mt-6 border-t border-gray-700 pt-6">
                                     <h2 className="text-xl font-bold text-cyan-400 mb-4">Ask a Question About the Document</h2>
                                    <QueryInput 
                                        query={query}
                                        onQueryChange={setQuery}
                                        onSubmit={handleSubmitQuery}
                                        disabled={status === 'processing' || isParsing}
                                    />
                                </div>
                                </>
                            )}
                        </div>
                    )}

                    {(status !== 'idle' || response) && (
                         <ResultDisplay 
                            status={status}
                            response={response}
                            errorMessage={errorMessage}
                        />
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;
