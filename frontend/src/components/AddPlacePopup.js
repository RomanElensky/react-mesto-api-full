import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
   const [name, setName] = React.useState("");
   const [link, setLink] = React.useState("");

   React.useEffect(() => {
      setName("");
      setLink("");
   }, [isOpen]);

   function handleSubmit(e) {
      e.preventDefault();
      onAddPlace(name, link);
   }

   function handleNameChange(e) {
      setName(e.target.value);
   }

   function handleLinkChange(e) {
      setLink(e.target.value);
   }

   return (
      <PopupWithForm
         name="card"
         title="Новое место"
         saveButton="Создать"
         isOpen={isOpen}
         onClose={onClose}
         onSubmit={handleSubmit}
      >
         <input
            name="card_name"
            id="card-name"
            type="text"
            placeholder="Название"
            className="popup__field popup__field_card_name"
            minLength={2}
            maxLength={30}
            value={name}
            onChange={handleNameChange}
            required
         />
         <span className="card-url-input-error popup__input-error"></span>
         <input
            name="card_link"
            type="url"
            id="card-link"
            className="popup__field popup__field_card_link"
            placeholder="Ссылка на картинку"
            value={link}
            onChange={handleLinkChange}
            required
         />
         <span className="card-url-input-error popup__input-error"></span>
      </PopupWithForm>
   );
}

export default AddPlacePopup;