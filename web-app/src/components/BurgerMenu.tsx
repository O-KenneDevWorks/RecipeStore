// Accessible burger/overflow menu that takes routes as a prop
// =============================================
import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styling/BurgerMenu.css';

export type MenuItem = {
    label: string;
    to?: string;            // route path for navigation
    onClick?: () => void;   // optional action handler
    disabled?: boolean;
};

interface BurgerMenuProps {
    items: MenuItem[];
    buttonLabel?: string;
    className?: string;
}

export default function BurgerMenu({ items, buttonLabel = 'Menu', className = '' }: BurgerMenuProps) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const listboxId = useId();

    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!menuRef.current) return;
            if (open && !menuRef.current.contains(e.target as Node)) setOpen(false);
        }
        function onEsc(e: KeyboardEvent) {
            if (e.key === 'Escape') setOpen(false);
        }
        document.addEventListener('mousedown', onDocClick);
        document.addEventListener('keydown', onEsc);
        return () => {
            document.removeEventListener('mousedown', onDocClick);
            document.removeEventListener('keydown', onEsc);
        };
    }, [open]);

    const isSquare = buttonLabel === '';

    return (
        <div ref={menuRef} className={`burger-menu ${className}`}>
            <button
                ref={buttonRef}
                type="button"
                className={`burger-btn ${isSquare ? 'square' : ''}`}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={listboxId}
                onClick={() => setOpen((v) => !v)}
            >
                <span className="burger-icon" aria-hidden>☰</span>
                {!isSquare && <span className="burger-label">{buttonLabel}</span>}
            </button>

            {open && (
                <ul id={listboxId} role="menu" className="burger-dropdown" onKeyDown={(e) => {
                    if (e.key === 'Tab') setOpen(false);
                }}>
                    {items.map((item, idx) => (
                        <li key={idx} role="none">
                            {item.to ? (
                                <Link
                                    role="menuitem"
                                    className={`burger-item ${item.disabled ? 'disabled' : ''}`}
                                    to={item.to}
                                    onClick={() => setOpen(false)}
                                    aria-disabled={item.disabled}
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <button
                                    role="menuitem"
                                    type="button"
                                    className={`burger-item ${item.disabled ? 'disabled' : ''}`}
                                    onClick={() => {
                                        if (!item.disabled) item.onClick?.();
                                        setOpen(false);
                                    }}
                                    disabled={item.disabled}
                                >
                                    {item.label}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}