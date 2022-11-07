import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
    const avatarRef = React.useRef();

    React.useEffect(() => {
        avatarRef.current.value = "";
    }, [isOpen]);

    function handleSubmit(e) {
        e.preventDefault();

        onUpdateAvatar({
            avatar: avatarRef.current.value,
        });
    }

    return (
        <PopupWithForm
            isOpen={isOpen}
            title="Обновить аватар"
            name="avatar"
            onClose={onClose}
            buttonText='Сохранить'
            onSubmit={handleSubmit}
        >
            <input
                name="avatar_link"
                type="url"
                id="avatar-input"
                className="popup__input popup__input_type_avatar"
                placeholder="Ссылка"
                defaultValue=""
                required
                ref={avatarRef}
            />
            <span className="popup__input popup__span avatar-input-error"></span>
        </PopupWithForm>
    );
}

export default EditAvatarPopup;