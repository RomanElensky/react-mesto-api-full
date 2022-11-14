import { useState } from "react";
import { Link } from "react-router-dom";

function Register({ handleRegister }) {
   const [data, setData] = useState({
      email: "",
      password: "",
   });

   function handleChange(e) {
      const { name, value } = e.target;

      setData({
         ...data,
         [name]: value,
      });
   };

   function handleSubmit(e) {
      e.preventDefault();
      const { email, password } = data;
      handleRegister(email, password);
   };

   return (
      <div className="authorization">
         <form onSubmit={handleSubmit} className="authorization__form">
            <h2 className="authorization__title">Регистрация</h2>
            <input
               id="email"
               name="email"
               type="email"
               placeholder="Email"
               className="authorization__input"
               value={data.email}
               onChange={handleChange}
               required
            />
            <input
               id="password"
               name="password"
               type="password"
               placeholder="Пароль"
               className="authorization__input"
               value={data.password}
               onChange={handleChange}
               required
            />
            <button
               type="submit"
               className="authorization__submit-button">Зарегистрироваться</button>
            <div className="authorization__sign-in">
               <Link to="/sign-in" className="authorization__link">Уже зарегистрированы? Войти</Link>
            </div>
         </form>
      </div>
   );
};

export default Register;