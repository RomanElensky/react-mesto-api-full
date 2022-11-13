import { getToken } from "../utils/token";

class Api {
    constructor({ headers, baseUrl }) {
        this._headers = headers;
        this._baseUrl = baseUrl;
    }

    getInfo() {
        console.log(this._baseUrl)
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'GET',
            headers: this._headers
        })
            .then(this._sendRequest)
    }

    patchInfo(name, about) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                name,
                about
            })
        })
            .then(this._sendRequest)
    }

    patchAvatar({avatar}) {
        return fetch(`${this._baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                avatar
            })
        })
            .then(this._sendRequest)
    }

    getCards() {
        return fetch(`${this._baseUrl}/cards`, {
            method: 'GET',
            headers: this._headers
        })
            .then(this._sendRequest)
    }

    postCard(name, link) {
        return fetch(`${this._baseUrl}/cards`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                name,
                link
            })
        })
            .then(this._sendRequest)
    }

    deleteCard(id) {
        return fetch(`${this._baseUrl}/cards/${id}`, {
            method: 'DELETE',
            headers: this._headers
        })
            .then(this._sendRequest)
    }

    addlike(id) {
        return fetch(`${this._baseUrl}/cards/${id}/likes`, {
            method: 'PUT',
            headers: this._headers
        })
            .then(this._sendRequest)
    }

    deleteLike(id) {
        return fetch(`${this._baseUrl}/cards/${id}/likes`, {
            method: 'DELETE',
            headers: this._headers
        })
            .then(this._sendRequest)
    }

    changeLikeStatus(cardId, isLiked) {
        return isLiked
          ? this.deleteLike(cardId)
          : this.addlike(cardId)
      }


    _sendRequest(res) {
        if (res.ok) {
            return res.json()
        }
        else {
            Promise.reject(`Ошибка ${res.status}`);
        }

    }
    
}

const api = new Api({
    baseUrl: 'http://localhost:3001',
    headers: {
        Accept: 'application/json',
        authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
    }
})

export { api }