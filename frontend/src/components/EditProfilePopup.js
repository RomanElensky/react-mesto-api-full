import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const currentUser = React.useContext(CurrentUserContext);

    React.useEffect(() => {
        setName(currentUser.name || '');
        setDescription(currentUser.about || '');
    }, [currentUser.about, currentUser.name, isOpen]);

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleJobChange(e) {
        setDescription(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        onUpdateUser(name, description);
    }

    return (
        <PopupWithForm
            isOpen={isOpen}
            title="Редактировать профиль"
            name="profile"
            onClose={onClose}
            buttonText='Сохранить'
            onSubmit={handleSubmit}
        >
            <input
                name="profile_name"
                id="input-name"
                type="text"
                className="popup__input popup__input_type_name"
                placeholder="Имя"
                value={name}
                minLength="2"
                maxLength="40"
                required
                onChange={handleNameChange}
            />
            <span className="popup__input popup__span input-name-error"></span>
            <input
                name="profile_info"
                id="input-info"
                type="text"
                className="popup__input popup__input_type_info"
                placeholder="Род деятельности"
                value={description}
                minLength="2"
                maxLength="200"
                required
                onChange={handleJobChange}
            />
            <span className="popup__input popup__span input-info-error"></span>
        </PopupWithForm>
    );
}

export default EditProfilePopup;