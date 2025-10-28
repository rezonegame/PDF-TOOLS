
import React, { useState, useCallback, useRef } from 'react';
import { UploadCloudIcon } from './icons';

interface PdfUploadProps {
    onFileChange: (file: File) => void;
    disabled: boolean;
}

export const PdfUpload: React.FC<PdfUploadProps> = ({ onFileChange, disabled }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (!disabled && e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileChange(e.dataTransfer.files[0]);
        }
    };
    
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileChange(e.target.files[0]);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const baseClasses = "relative block w-full rounded-lg border-2 border-dashed border-gray-600 p-12 text-center transition-colors duration-300";
    const activeClasses = isDragging ? "bg-gray-700/50 border-cyan-400" : "hover:border-gray-500";
    const disabledClasses = disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer";

    return (
        <div
            className={`${baseClasses} ${activeClasses} ${disabledClasses}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileSelect}
                disabled={disabled}
            />
            <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-500" />
            <span className="mt-2 block text-sm font-semibold text-gray-300">
                Drag & drop a PDF here, or click to select a file
            </span>
            <p className="text-xs text-gray-500">PDF documents only</p>
        </div>
    );
};
