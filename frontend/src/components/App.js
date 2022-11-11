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
import * as auth from "../utils/auth";

function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isTooltipPopupOpen, setTooltipPopup] = React.useState(false);
  const [onInfoTooltip, setOnInfoTooltip] = React.useState(false);
  const [isLogin, setIsLogin] = React.useState(false);
  const [data, setData] = React.useState({
    email: "",
    password: "",
  });

  const history = useHistory();

  const handleEditAvatarClick = () => setEditAvatarPopupOpen(true);
  const handleEditProfileClick = () => setEditProfilePopupOpen(true);
  const handleAddPlaceClick = () => setAddPlacePopupOpen(true);
  const closeAllPopups = () => {
    setAddPlacePopupOpen(false);
    setEditProfilePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setTooltipPopup(false);
    setSelectedCard(null);
  };

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  React.useEffect(() => {
    api.getInfo()
      .then((res) => {
        setCurrentUser(res);
      })
      .catch((err) => {
        console.log(`Ошибка ${err}`);
      });

    api.getCards()
      .then((cardsData) => {
        setCards(cardsData);
      })
      .catch((err) => {
        console.log(`Ошибка ${err}`);
      });
  }, [])

  React.useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    });
  }, []);

  React.useEffect(() => {
    const chekToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        auth.getContent(token)
          .then((res) => {
            if (res && res.data.email) {
              setData({
                email: res.data.email,
              });
              setIsLogin(true);
              history.push("/");
            } else {
              history.push("/sign-in");
            }
          })
          .catch((err) => {
            console.log(`Ошибка ${err}`);
          });
      }
    };
    chekToken();
  }, [history]);

  function handleLogin(email, password) {
    auth.authorize(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          setData({
            email: data.email,
          });
          setIsLogin(true);
          history.replace({ pathname: "/" });
        }
      })
      .catch((res) => {
        console.log(res);
      });
  };

  function handleLogout() {
    localStorage.removeItem("token");
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
    api.patchInfo(name, about)
      .then((item) => {
        setCurrentUser(item);
        closeAllPopups();
      })
      .catch((err) =>
        console.log(`Ошибка ${err}`))
  };

  function handleUpdateAvatar(avatar) {
    api.patchAvatar(avatar)
      .then((item) => {
        setCurrentUser(item);
        closeAllPopups();
      })
      .catch((err) =>
        console.log(`Ошибка ${err}`))
  };

  function handleAddPlaceSubmit(name, link) {
    api.postCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) =>
        console.log(`Ошибка ${err}`))
  };

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeStatus(card._id, isLiked)
    .then((newCard) => {
      const newCards = cards.map((item) => (item._id === card._id ? newCard : item));
      setCards(newCards);
    })
    .catch((err) =>
        console.log(`Ошибка ${err}`))
  }


  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((err) =>
        console.log(`Ошибка ${err}`))
  };

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header
          handleLogout={handleLogout}
          loggedIn={isLogin}
          email={data.email}
        />
        <Switch>
          <ProtectedRoute
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            cards={cards}
            component={Main}
            loggedIn={isLogin}
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
