import React from "react";
import Card from "./Card.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Main({ onEditProfile, onEditAvatar, onAddPlace, onCardClick, cards, onCardLike, onCardDelete }) {

  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="main">
      <section className="profile">
        <div className="profile__image-container">
          <img
            src={currentUser.avatar}
            className="profile__image"
            alt="Аватар"
          />
          <button
            onClick={onEditAvatar}
            className="profile__edit-image"
          ></button>
        </div>
        <div className="profile__title">
          <div className="profile__info">
            <h1 className="profile__name">{currentUser.name}</h1>
            <p className="profile__description">{currentUser.about}</p>
          </div>
          <button
            onClick={onEditProfile}
            className="profile__edit-button"
          ></button>
        </div>
        <button onClick={onAddPlace} className="profile__add-button"></button>
      </section>

      <section className="card">
        {cards.map((card) => (
          <Card key={card._id} card={card} onCardClick={onCardClick} onCardLike={onCardLike} onCardDelete={onCardDelete} />
        ))}
      </section>
    </main>
  );
}

export default Main;