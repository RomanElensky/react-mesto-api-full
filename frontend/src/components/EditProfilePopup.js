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

   function handleSubmit(e) {
      e.preventDefault();
      onUpdateUser(name, description);
   }

   function handleNameChange(e) {
      setName(e.target.value);
   }

   function handleJobChange(e) {
      setDescription(e.target.value);
   }

   return (
      <PopupWithForm
         name="profile"
         title="Редактировать профиль"
         saveButton="Сохранить"
         isOpen={isOpen}
         onClose={onClose}
         onSubmit={handleSubmit}
      >
         <input
            name="profile_name"
            id="input-name"
            type="text"
            className="popup__field popup__field_input_name"
            placeholder="Имя"
            minLength="2"
            maxLength="40"
            value={name}
            onChange={handleNameChange}
            required
         />
         <span className="name-input-error popup__input-error"></span>
         <input
            name="profile_info"
            id="input-info"
            type="text"
            className="popup__field popup__field_input_job"
            placeholder="Род деятельности"
            minLength="2"
            maxLength="200"
            value={description}
            onChange={handleJobChange}
            required
         />
         <span className="job-input-error popup__input-error"></span>
      </PopupWithForm>
   );
}

export default EditProfilePopup;