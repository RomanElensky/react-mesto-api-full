import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {

   const currentUser = React.useContext(CurrentUserContext);
   const isOwn = card.owner === currentUser._id;
   const isLiked = card.likes.some(i => i === currentUser._id);

   const cardLikeButtonClassName = (
      `card__like ${isLiked && 'card__like_active'}`
   );

   const cardDeleteButtonClassName = (
      `card__delete ${isOwn ? '' : 'card__delete_hidden'}`
   );

   function handleClick() {
      onCardClick(card);
   }

   function handleLikeClick() {
      onCardLike(card);
   }

   function handleDeleteClick() {
      onCardDelete(card);
   }

   return (
      <li className="card__element">
         <img className="card__image" alt={card.name} src={card.link} onClick={handleClick} />
         <div className="card__block">
            <button type="button" onClick={handleDeleteClick} className={cardDeleteButtonClassName}></button>
            <h2 className="card__name">{card.name}</h2>
            <div className="card__element-container">
               <button type="button" onClick={handleLikeClick} className={cardLikeButtonClassName}></button>
               <span className="card__like-count">{card.likes.length}</span>
            </div>
         </div>
      </li>
   );
}

export default Card;