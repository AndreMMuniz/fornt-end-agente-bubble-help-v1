'use client';

import { useState } from 'react';
import type { UserSettings } from '@/hooks/useSettings';
import styles from './settingsModal.module.css';

type SettingsModalProps = {
    isOpen: boolean;
    onClose: () => void;
    settings: UserSettings;
    onSave: (updates: Partial<UserSettings>) => void;
};

const LANGUAGES = [
    { code: 'pt', label: 'Português' },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
];

export default function SettingsModal({ isOpen, onClose, settings, onSave }: SettingsModalProps) {
    const [language, setLanguage] = useState(settings.language);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ language });
        onClose();
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Settings</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className={styles.content}>
                    {/* Agent Language */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                            <h3 className={styles.sectionTitle}>Agent Language</h3>
                        </div>
                        <p className={styles.sectionDesc}>Choose the language the AI agent will use to respond.</p>
                        <select
                            className={styles.select}
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            {LANGUAGES.map(lang => (
                                <option key={lang.code} value={lang.code}>{lang.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Appearance — Placeholder */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" />
                                <line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                            <h3 className={styles.sectionTitle}>Appearance</h3>
                        </div>
                        <p className={styles.comingSoon}>Coming soon — theme, font size, and more.</p>
                    </div>

                    {/* Account — Placeholder */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            <h3 className={styles.sectionTitle}>Account</h3>
                        </div>
                        <p className={styles.comingSoon}>Coming soon — profile, notifications, and data management.</p>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                    <button className={styles.saveBtn} onClick={handleSave}>Save Changes</button>
                </div>
            </div>
        </div>
    );
}
