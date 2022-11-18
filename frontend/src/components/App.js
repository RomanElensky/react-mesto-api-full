import React from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import AddPlacePopup from "./AddPlacePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import EditProfilePopup from "./EditProfilePopup";
import InfoTooltip from "./InfoTooltip";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import { api } from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import { setToken, getToken, removeToken } from "../utils/token";
import * as auth from "../utils/auth";



function App() {
    const [cards, setCards] = React.useState([]);
    const [selectedCard, setSelectedCard] = React.useState({});
    const [currentUser, setCurrentUser] = React.useState({});
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [isTooltipPopupOpen, setTooltipPopup] = React.useState(false);
    const [onInfoTooltip, setOnInfoTooltip] = React.useState({});
    const [isLogin, setIsLogin] = React.useState(false);
    const [profileEmail, setProfileEmail] = React.useState("");

    const history = useHistory();

    function closeAllPopups() {
        setSelectedCard({});
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setTooltipPopup(false);
    }

    function handleCardClick(card) {
        setSelectedCard(card);
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
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
                .catch((err) => {
                    console.log(`Ошибка ${err}`);
                });
        }
    }, [isLogin])

    function tokenCheck() {
        const jwt = getToken();
        if (jwt) {
            auth.getContent(jwt)
                .then((res) => {
                    if (res && res.email) {
                        setCurrentUser(res);
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

    function signOut() {
        removeToken();
        setProfileEmail("");
        setIsLogin(false);
        history.push("/sign-in");
    };

    function handleLogin(email, password) {
        auth.authorize(email, password)
            .then((data) => {
                setProfileEmail(email);
                setToken(data.token);
                setIsLogin(true);
                history.replace({ pathname: "/" });
            })
            .catch((res) => {
                console.log(res);
                setTooltipPopup(true);
                setOnInfoTooltip(false);
            });
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
                console.log(`Ошибка ${err}`)
            );
    };

    const handleCardDelete = (card) => {
        api.deleteCard(card._id)
            .then(() => {
                setCards((cards) => cards.filter((c) => c._id !== card._id));
            })
            .catch((err) => console.log(`Ошибка ${err}`));
    };

    return (
        <div className="page">
            <CurrentUserContext.Provider value={currentUser}>
                <Header
                    loggedIn={isLogin}
                    email={profileEmail}
                    signOut={signOut}
                />
                <Switch>
                    <ProtectedRoute
                        cards={cards}
                        component={Main}
                        onEditProfile={handleEditProfileClick}
                        onEditAvatar={handleEditAvatarClick}
                        onAddPlace={handleAddPlaceClick}
                        onCardClick={handleCardClick}
                        onCardLike={handleCardLike}
                        onCardDelete={handleCardDelete}
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
                <InfoTooltip
                    onInfoTooltip={onInfoTooltip}
                    isOpen={isTooltipPopupOpen}
                    onClose={closeAllPopups}
                />
                <EditProfilePopup
                    onUpdateUser={handleUpdateUser}
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopups}
                />
                <AddPlacePopup
                    onAddPlace={handleAddPlaceSubmit}
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopups}
                />
                <EditAvatarPopup
                    onUpdateAvatar={handleUpdateAvatar}
                    isOpen={isEditAvatarPopupOpen}
                    onClose={closeAllPopups}
                />
                <ImagePopup card={selectedCard} onClose={closeAllPopups} />
            </CurrentUserContext.Provider>
        </div>
    );
};

export default App;