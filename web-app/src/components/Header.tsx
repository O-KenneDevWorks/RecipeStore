import { useState, useEffect } from 'react';
import '../Styling/Header.css'
import '../Styling/Global.css';
import '../Styling/theme.css';
import { Themes } from '../constants/options'

const Header = () => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.className = theme; // Apply theme as a class to <body>
    }, [theme]);

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTheme(event.target.value);
    };

    return (
        <header className="header">
            <a href="/" className="logo">
                The Recipe Store
            </a>
            <div className="theme-selector">
                <label htmlFor="theme-selector">Theme:</label>
                <select
                    id="theme-selector"
                    value={theme}
                    onChange={handleThemeChange}
                >
                    {Themes.map((themeOption) => (
                        <option key={themeOption.value} value={themeOption.value}>
                            {themeOption.label}
                        </option>
                    ))}
                </select>
            </div>
        </header>
    );
};

export default Header;