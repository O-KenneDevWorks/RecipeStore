import { useState, useEffect } from 'react';
import '../Styling/Header.css'
import '../Styling/Global.css';
import '../Styling/theme.css';

const Header = () => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <div style={{ height: '50px', backgroundColor: '#f8f9fa' }}>
            <button className='theme-toggle' onClick={toggleTheme}>
                Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
            </button>
        </div>
    );
};

export default Header;
