import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {

  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = card.owner === currentUser._id;
  const isLiked = card.likes.some(i => i === currentUser._id);

  const handleClick = () => {
    onCardClick(card);
  }

  const handleLikeClick = () => {
    onCardLike(card);
  }

  const cardLikeButtonClassName = (
    `card__like ${isLiked && 'card__like_clicked'}`
  );

  const handleDeleteClick = () => {
    onCardDelete(card);
  }

  const cardDeleteButtonClassName = (
    `card__trash-button ${isOwn ? 'card__trash-button_active' : 'card__trash-button_hidden'}`
  );

  return (
    <article key={card._id} className="card__element">
      <img src={card.link} alt={card.name} className="card__image" onClick={handleClick} />
      <button onClick={handleDeleteClick} className={cardDeleteButtonClassName}></button>
      <div className="card__description">
        <h2 className="card__name">{card.name}</h2>
        <div className="card__likes">
          <button onClick={handleLikeClick} className={cardLikeButtonClassName}></button>
          <p className="card__like-amount">{card.likes.length}</p>
        </div>
      </div>
    </article>
  );
}

export default Card