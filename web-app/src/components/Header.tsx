import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../Styling/Header.css'
import '../Styling/Global.css';
import '../Styling/theme.css';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

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
            </div>
        </header>
    );
};

export default Header;