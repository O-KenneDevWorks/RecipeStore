import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Styling/NavBar.css'

const NavBar = () => {
    const location = useLocation();
    
    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
                </li>
                <li>
                    <Link to="/add-recipe" className={location.pathname === '/add-recipe' ? 'active' : ''}>Add Recipe</Link>
                </li>
                <li>
                    <Link to="/view-recipes" className={location.pathname === '/view-recipes' ? 'active' : ''}>View All</Link>
                </li>
                <li>
                    <Link to="/add-pantry-item" className={location.pathname === '/add-pantry-item' ? 'active' : ''}>Add Pantry Item</Link>
                </li>
                <li>
                    <Link to="/pantry" className={location.pathname === '/pantry' ? 'active' : ''}>Pantry</Link>
                </li>
            </ul>
        </nav>
    )
};

export default NavBar;