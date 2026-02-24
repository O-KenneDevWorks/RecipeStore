import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../Styling/Header.css'
import '../Styling/Global.css';
import '../Styling/theme.css';
import { Themes } from '../constants/options'

const Header = () => {
    const [theme, setTheme] = useState('light');
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.className = theme; // Apply theme as a class to <body>
    }, [theme]);

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTheme(event.target.value);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <a href="/" className="logo">
                The Recipe Store
            </a>
            <div className="header-controls">
                {user && (
                    <div className="user-menu">
                        <span className="user-name">Welcome, {user.name}</span>
                        <button onClick={handleLogout} className="logout-button">
                            Logout
                        </button>
                    </div>
                )}
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
            </div>
        </header>
    );
};

export default Header;