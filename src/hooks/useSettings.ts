'use client';

import { useState, useEffect, useCallback } from 'react';

export type UserSettings = {
    language: string;
};

const DEFAULT_SETTINGS: UserSettings = {
    language: 'pt',
};

const STORAGE_KEY = 'user_settings';

export function useSettings() {
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
            }
        } catch {
            // Ignore parse errors
        }
    }, []);

    const updateSettings = useCallback((updates: Partial<UserSettings>) => {
        setSettings(prev => {
            const next = { ...prev, ...updates };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    return { settings, updateSettings };
}
