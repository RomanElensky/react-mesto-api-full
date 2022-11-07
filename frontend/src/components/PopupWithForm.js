import React from "react";

function PopupWithForm({ name, title, isOpen, onClose, children, buttonText, onSubmit }) {
  return (
    <div
      className={`popup popup_type_${name} ${isOpen && "popup_opened"}`}
    >
      <div className="popup__container">
        <button
          onClick={onClose}
          className="popup__close-button"
        ></button>
        <form
          className="popup__input-container"
          name={`form__${name}`}
          noValidate
          onSubmit={onSubmit}
        >
          <h2 className="popup__title">{`${title}`}</h2>
          <fieldset className="popup__fieldset">
            {children}
          </fieldset>
          <button className="popup__submit-button" type="submit">
            {buttonText}
          </button>
        </form>
        <div
          onClick={onClose}
          className="popup__overlay"
        ></div>
      </div>
    </div>
  );
}

export default PopupWithForm;