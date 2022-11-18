import { getToken } from "../utils/token";

class Api {
   constructor({ baseUrl, headers }) {
      this._headers = headers
      this._baseUrl = baseUrl
   }

   getProfile() {
      return fetch(`${this._baseUrl}/users/me`, {
         method: 'GET',
         headers: this._headers()
      })
         .then(this._sendRequest)
   }

   editProfile(name, about) {
      return fetch(`${this._baseUrl}/users/me`, {
         method: "PATCH",
         headers: this._headers(),
         body: JSON.stringify({
            name,
            about
         })
      })
         .then(this._sendRequest)
   }

   editAvatar({ avatar }) {
      return fetch(`${this._baseUrl}/users/me/avatar`, {
         method: "PATCH",
         headers: this._headers(),
         body: JSON.stringify({
            avatar
         })
      })
         .then(this._sendRequest)
   }

   getInitialCards() {
      return fetch(`${this._baseUrl}/cards`, {
         method: 'GET',
         headers: this._headers()
      })
         .then(this._sendRequest)
   }

   addCard(name, link) {
      return fetch(`${this._baseUrl}/cards`, {
         method: "POST",
         headers: this._headers(),
         body: JSON.stringify({
            name,
            link
         })
      })
         .then(this._sendRequest)
   }

   deleteCard(id) {
      return fetch(`${this._baseUrl}/cards/${id}`, {
         method: "DELETE",
         headers: this._headers()
      })
         .then(this._sendRequest)
   }

   addLike(id) {
      return fetch(`${this._baseUrl}/cards/${id}/likes`, {
         method: "PUT",
         headers: this._headers()
      })
         .then(this._sendRequest)
   }

   deleteLike(id) {
      return fetch(`${this._baseUrl}/cards/${id}/likes`, {
         method: "DELETE",
         headers: this._headers()
      })
         .then(this._sendRequest)
   }

   _sendRequest(res) {
      if (res.ok) {
         return res.json()
      }
      else {
         return Promise.reject(res.statusText)
      }
   }
}

export const api = new Api({
   baseUrl: "api.mesto.balrok.nomoredomains.icu",
   headers() {
      return {
         Accept: 'application/json',
         authorization: `Bearer ${getToken()}`,
         'Content-Type': 'application/json'
      }
   }
});
