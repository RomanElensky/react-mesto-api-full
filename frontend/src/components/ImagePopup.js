import React from "react";

function ImagePopup({ card, onClose }) {
    return (
        <div className={`popup popup_type_image ${card.name ? 'popup_opened' : ''}`}>
            <div className="popup__image-container">
                <button onClick={onClose} className="popup__close-button"></button>
                <img className="popup__image" src={card.link} alt={card.name} />
                <p className="popup__image-title">{card.name}</p>
                <div onClick={onClose} className="popup__overlay"></div>
            </div>
        </div>
    )
}

export default ImagePopup