import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Styling/NavBar.css'

const NavBar = () => {
    const location = useLocation();
    const pages = [
        { path: '/', name: 'Home' },
        { path: '/add-recipe', name: 'Add Recipe' },
        { path: '/view-recipes', name: 'View Recipes' },
        { path: '/pantry', name: 'Pantry' },
        { path: '/add-pantry-item', name: 'Add Pantry Item' },
        { path: '/random-recipe', name: 'Random Recipe' },
        { path: '/meal-planner', name: 'Meal Planner' },
    ]
    
    return (
        <nav className="nav-bar">
            <ul className='navbar-links'>
                {pages.map(page => (
                    location.pathname !== page.path && (
                        <li key={page.name}>
                            <Link to={page.path}>{page.name}</Link>
                        </li>
                    )
                ))}
            </ul>
        </nav>
    )
};

export default NavBar;