import React from 'react';
import './Styling/Header.css'

const Header = () => {

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };
    
    return (
        <div style={{ height: '50px', backgroundColor: '#f8f9fa' }}> {/* Example styling */}
            <button className='theme-toggle' onClick={toggleTheme}>
                Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
            </button>
            {/* Additional content or simply leave empty for spacing */}
        </div>
    );
};

export default Header;
