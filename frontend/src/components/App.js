import React from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import { api } from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import { setToken, getToken, removeToken } from "../utils/token";
import * as auth from "../utils/auth";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isTooltipPopupOpen, setTooltipPopup] = React.useState(false);
  const [onInfoTooltip, setOnInfoTooltip] = React.useState({});
  const [isLogin, setIsLogin] = React.useState(false);
  const [data, setData] = React.useState({
    email: "",
    password: "",
  });

  const history = useHistory();


  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setSelectedCard({});
    setTooltipPopup(false);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  React.useEffect(() => {
    tokenCheck();
  }, []);

  React.useEffect(() => {
    if (isLogin) {
      Promise.all([api.getProfile(), api.getInitialCards()]).then(([data, cardList]) => {
        setCurrentUser(data)
        setCards(cardList.reverse())
      })
        .catch((err) =>
          console.log(`Ошибка ${err}`))
    }
  }, [isLogin])

  React.useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    });
  }, []);

  function tokenCheck() {
    const jwt = getToken();
    if (jwt) {
      auth.getContent(jwt)
        .then((res) => {
          if (res && res.email) {
            setData({
              email: res.email,
            });
            setIsLogin(true);
            history.push("/");
          } else {
            history.push("/sign-in");
          }
        })
        .catch((err) =>
          console.log(`Ошибка ${err}`))
    }
  };

  function handleLogin(email, password) {
    auth.authorize(email, password)
      .then((data) => {
        setToken(data.token);
        setData({
          email: data.email,
        });
        setIsLogin(true);
        history.replace({ pathname: "/" });
      })
      .catch((res) => {
        console.log(res);
        setTooltipPopup(true);
        setOnInfoTooltip(false);
      });
  };

  function signOut() {
    removeToken();
    setData({
      email: "",
      password: "",
    });
    setIsLogin(false);
    history.push("/sign-in");
  };

  function handleRegister(email, password) {
    auth.register(email, password)
      .then(() => {
        setTooltipPopup(true);
        setOnInfoTooltip(true);
        history.push("/sign-in");
      })
      .catch((res) => {
        console.log(res);
        setTooltipPopup(true);
        setOnInfoTooltip(false);
      });
  };

  function handleUpdateUser(name, about) {
    api.editProfile(name, about)
      .then(({ name, about }) => {
        setCurrentUser((prevUserState) => {
          return { ...prevUserState, name, about };
        });

        closeAllPopups();
      })
      .catch((err) =>
        console.log(`Ошибка ${err}`)
      );
  };

  function handleUpdateAvatar(avatar) {
    api.editAvatar(avatar)
      .then(({ avatar }) => {
        setCurrentUser((prevUserState) => {
          return { ...prevUserState, avatar };
        });
        closeAllPopups();
      })
      .catch((err) =>
        console.log(`Ошибка ${err}`)
      );
  };

  const handleAddPlaceSubmit = (name, link) => {
    api.addCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) =>
        console.log(`Ошибка ${err}`)
      );
  };

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i === currentUser._id);
    const changeLikeCardStatus = !isLiked
      ? api.addLike(card._id)
      : api.deleteLike(card._id);
    changeLikeCardStatus
      .then((newCard) => {
        setCards((item) =>
          item.map((c) => (c._id === card._id ? newCard.card : c))
        );
      })
      .catch((err) =>
        console.log(`Ошибка ${err}`))
  };


  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) =>
        console.log(`Ошибка ${err}`))
  };

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header
          signOut={signOut}
          loggedIn={isLogin}
          email={data.email}
        />
        <Switch>
          <ProtectedRoute
            component={Main}
            loggedIn={isLogin}
            onEditProfile={handleEditProfileClick}
            onEditAvatar={handleEditAvatarClick}
            onAddPlace={handleAddPlaceClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            onCardClick={handleCardClick}
            path="/"
            exact
          />
          <Route path="/sign-in">
            <Login handleLogin={handleLogin} />
          </Route>
          <Route path="/sign-up">
            <Register handleRegister={handleRegister} />
          </Route>
          <Route>
            {isLogin ? (
              <Redirect to="/" />
            ) : (
              <Redirect to="/sign-in" />
            )}
          </Route>
        </Switch>
        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />
        <InfoTooltip
          isOpen={isTooltipPopupOpen}
          onClose={closeAllPopups}
          onInfoTooltip={onInfoTooltip}
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
