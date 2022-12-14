import React, { useState } from "react";

function Login({ handleLogin }) {
   const [data, setData] = useState({
      email: "",
      password: "",
   });

   function handleSubmit(e) {
      e.preventDefault();
      if (!data.email || !data.password) {
         return;
      }
      const { email, password } = data;
      handleLogin(email, password);
   };

   function handleChange(e) {
      const { name, value } = e.target;
      setData({
         ...data,
         [name]: value,
      });
   };

   return (
      <div className="authorization">
         <form onSubmit={handleSubmit} className="authorization__form">
            <h2 className="authorization__title">Вход</h2>
            <input
               name="email"
               type="email"
               id="email"
               placeholder="Email"
               className="authorization__input"
               value={data.email}
               onChange={handleChange}
               required
            />
            <input
               name="password"
               type="password"
               id="password"
               placeholder="Пароль"
               className="authorization__input"
               value={data.password}
               onChange={handleChange}
               required
            />
            <button
               type="submit"
               className="authorization__save-submit">Войти</button>
         </form>
      </div>
   );
};

export default Login;