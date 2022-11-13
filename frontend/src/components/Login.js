import React, { useState } from "react";

const Login = ({ handleLogin }) => {
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
        if (!data.email || !data.password) {
            return;
        }
        const { email, password } = data;
        handleLogin(email, password);
    };

    return (
        <div className="authorization">
            <form onSubmit={handleSubmit} className="authorization__form">
                <h2 className="authorization__title">Вход</h2>
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
                    className="authorization__submit-button">Войти</button>
            </form>
        </div>
    );
}

export default Login;