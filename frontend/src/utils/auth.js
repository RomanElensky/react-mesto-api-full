export const BASE_URL = "https://api.mesto.balrok.nomoredomains.icu";

function checkResponse(res) {
   if (res.ok) {
      return res.json();
   }
   return Promise.reject(`Ошибка ${res.status}`);
};

export function register(email, password) {
   return fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
   }).then(checkResponse);
};

export function authorize(email, password) {
   return fetch(`${BASE_URL}/signin`, {
      method: "POST",
      headers: {
         'Accept': 'application/json',
         "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
   }).then(checkResponse);
};

export function getContent(token) {
   return fetch(`${BASE_URL}/users/me`, {
      method: "GET",
      headers: {
         'Accept': 'application/json',
         "Content-Type": "application/json",
         authorize: `Bearer ${token}`,
      },
   }).then(checkResponse);
};