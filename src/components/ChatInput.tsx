'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './ChatInput.module.css';

interface ChatInputProps {
    onSendMessage: (message: string, image?: string) => void;
    isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
    const [input, setInput] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if ((input.trim() || selectedImage) && !isLoading) {
            // Strip the data URL prefix for the backend
            // format: "data:image/png;base64,iVBOR..." -> "iVBOR..."
            const imageToSend = selectedImage ? selectedImage.split(',')[1] : undefined;

            onSendMessage(input, imageToSend);
            setInput('');
            setSelectedImage(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Store the full data URL for preview
                const base64String = reader.result as string;
                setSelectedImage(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle paste event for images
    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    e.preventDefault(); // Prevent pasting the image filename/binary garbage into text
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64String = reader.result as string;
                        setSelectedImage(base64String);
                    };
                    reader.readAsDataURL(file);
                    return; // Only process the first image found
                }
            }
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const removeImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    return (
        <form className={styles.container} onSubmit={handleSubmit}>
            <div className={`${styles.inputWrapper} shadow-md`}>

                {/* Image Preview Area */}
                {selectedImage && (
                    <div className={styles.previewContainerVisible} style={{ width: '100%' }}>
                        <div className={styles.previewWrapper}>
                            <img src={selectedImage} alt="Preview" className={styles.previewImage} />
                            <button type="button" onClick={removeImage} className={styles.removePreview}>
                                ×
                            </button>
                        </div>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    style={{ display: 'none' }}
                />

                <button type="button" className={styles.attachButton} onClick={triggerFileInput} title="Attach image">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(45)">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                </button>
                <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    placeholder="Type a message..."
                    className={styles.textarea}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className={styles.sendButton}
                    disabled={(!input.trim() && !selectedImage) || isLoading}
                >
                    {isLoading ? (
                        <div className={styles.loader} />
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    )}
                </button>
            </div>
        </form>
    );
}
