import React from "react";
import success from "../images/success.svg";
import fail from "../images/fail.svg";

function InfoTooltip({ isOpen, onClose, onInfoTooltip }) {
   return (
      <div className={`popup ${isOpen && "popup_opened"}`}>
         <div className="popup__container popup__container_infotooltip">
            <button
               type="button"
               className="popup__close"
               onClick={onClose}
            ></button>
            <img src={onInfoTooltip ? success : fail} alt="Значок" />
            <p className="popup__profile_tooltip">
               {onInfoTooltip
                  ? `Вы успешно зарегистрировались!`
                  : `Что-то пошло не так! Попробуйте ещё раз.`}
            </p>
         </div>
      </div>
   );
};

export default InfoTooltip;