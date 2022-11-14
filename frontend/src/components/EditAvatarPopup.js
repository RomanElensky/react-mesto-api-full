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
         name="avatar"
         title="Обновить аватар"
         saveButton="Сохранить"
         isOpen={isOpen}
         onClose={onClose}
         onSubmit={handleSubmit}
      >
         <input
            name="avatar_link"
            type="url"
            id="avatar-input"
            placeholder="Ссылка на картинку"
            className="popup__field popup__field_avatar_link"
            ref={avatarRef}
            required
         />
         <span className="avatar-input-error popup__input-error"></span>
      </PopupWithForm>
   );
}

export default EditAvatarPopup;