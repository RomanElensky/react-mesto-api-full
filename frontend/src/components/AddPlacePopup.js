import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
    const [name, setName] = React.useState("");
    const [link, setLink] = React.useState("");

    React.useEffect(() => {
        setName("");
        setLink("");
    }, [isOpen]);

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleLinkChange(e) {
        setLink(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        onAddPlace(name, link);
    }

    return (
        <PopupWithForm
            isOpen={isOpen}
            title="Новое место"
            name="card"
            onClose={onClose}
            buttonText='Создать'
            onSubmit={handleSubmit}
        >
            <input
                name="card_name"
                id="card-name"
                type="text"
                className="popup__input popup__input_type_card"
                placeholder="Название"
                value={name}
                minLength="2"
                maxLength="30"
                required
                onChange={handleNameChange}
            />
            <span className="popup__input popup__span card-name-error"></span>
            <input
                name="card_link"
                type="url"
                id="card-link"
                className="popup__input popup__input_type_link"
                placeholder="Ссылка на картинку"
                value={link}
                required
                onChange={handleLinkChange}
            />
            <span className="popup__input popup__span card-info-error"></span>
        </PopupWithForm>
    );
}

export default AddPlacePopup;