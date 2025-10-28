
import { useState, useEffect } from 'react';

// pdfjsLib is globally available from the script tag in index.html
declare const pdfjsLib: any;

export const usePdfProcessor = (file: File | null) => {
    const [text, setText] = useState<string>('');
    const [pageCount, setPageCount] = useState<number>(0);
    const [isParsing, setIsParsing] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!file) {
            reset();
            return;
        }

        const processPdf = async () => {
            setIsParsing(true);
            setError('');
            setText('');
            setPageCount(0);

            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                setPageCount(pdf.numPages);
                
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map((item: any) => item.str).join(' ');
                    fullText += pageText + '\n\n';
                }
                setText(fullText);
            } catch (err) {
                console.error("Error processing PDF:", err);
                setError(err instanceof Error ? err.message : 'An unknown error occurred during PDF parsing.');
                setText('');
            } finally {
                setIsParsing(false);
            }
        };

        processPdf();

    }, [file]);

    const reset = () => {
        setText('');
        setPageCount(0);
        setIsParsing(false);
        setError('');
    };

    return { text, isParsing, error, pageCount, reset };
};
