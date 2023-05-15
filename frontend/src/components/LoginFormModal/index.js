import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const disableButton = credential === "" || password === "";

  // const disableButton = credential.length < 4 || password.length < 6;

  const handleDemoLogin = () => {

    return dispatch(sessionActions.login({ credential: "demo@user.io", password: "password" }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  console.log("Disabled Button", disableButton)

  return (
    <div className="login-form-container">
      <h1 className="login-form-title">Log In</h1>
      <form onSubmit={handleSubmit}>
        <label className="labels">
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            className="login-form-input"
          />
        </label>
        <label className="labels">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-form-input"
          />
        </label>
        {errors.credential && <p className="errors">{errors.credential}</p>}
        <button type="submit" className="login-form-button" disabled={disableButton}>
          Log In
        </button>
        <button type="demo-button-login" className="demo-login-button" onClick={handleDemoLogin}>
          Log in as Demo User
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
