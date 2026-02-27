import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export const THEMES = [
    { value: '',           label: 'Default (Light)' },
    { value: 'theme-dark',    label: 'Dark' },
    { value: 'theme-minimal', label: 'Minimal' },
    { value: 'theme-warm',    label: 'Warm' },
    { value: 'theme-organic', label: 'Organic' },
    { value: 'theme-modern',  label: 'Modern' },
    { value: 'theme-rustic',  label: 'Rustic' },
    { value: 'theme-vibrant', label: 'Vibrant' },
] as const;

interface ThemeContextType {
    theme: string;
    setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
    return ctx;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<string>(() => {
        return localStorage.getItem('theme') ?? '';
    });

    const setTheme = (newTheme: string) => {
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
        const root = document.documentElement;
        // Remove all existing theme classes
        THEMES.forEach(({ value }) => { if (value) root.classList.remove(value); });
        if (theme) root.classList.add(theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
