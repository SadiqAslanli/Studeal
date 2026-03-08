"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '@/utils/translations';

type LanguageContextType = {
    lang: Language;
    t: typeof translations.az;
    setLang: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Language>('az');

    useEffect(() => {
        const savedLang = localStorage.getItem('studeal_lang') as Language;
        if (savedLang && (savedLang === 'az' || savedLang === 'en')) {
            setLangState(savedLang);
        }
    }, []);

    const setLang = (newLang: Language) => {
        setLangState(newLang);
        localStorage.setItem('studeal_lang', newLang);
    };

    const t = translations[lang];

    return (
        <LanguageContext.Provider value={{ lang, t, setLang }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
