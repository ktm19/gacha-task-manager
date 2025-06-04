import React from 'react';
import '../styles/itemcard.css';

const ItemCard = ({ image, description, position }) => {
    if (!image || !description) return null;

    const style = {
        left: position?.x ? `${position.x}px` : '0',
        top: position?.y ? `${position.y}px` : '0',
    };

    return (
        <div className="item-card" style={style}>
            <p className="description">{description}</p>
        </div>
    );
};

export default ItemCard;