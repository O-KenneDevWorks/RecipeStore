import React from 'react';
import ReactModal from 'react-modal';
import '../Styling/ShoppingList.css';

interface ShoppingListProps {
    isOpen: boolean;
    onClose: () => void;
    shoppingList: Record<string, number>;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ isOpen, onClose, shoppingList }) => {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Shopping List"
            className="modal"
            overlayClassName="overlay"
        >
            <h2>Shopping List</h2>
            <ul>
                {Object.entries(shoppingList).map(([ingredient, amount]) => (
                    <li key={ingredient}>
                        {ingredient}: {amount}
                    </li>
                ))}
            </ul>
            <button onClick={onClose} className="close-button">
                Close
            </button>
        </ReactModal>
    );
};

export default ShoppingList;
