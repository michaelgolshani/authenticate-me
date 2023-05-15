import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  // const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
            console.log("WE ARE IN DATA.ERRORS")
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  // const SubmitDisabled = Object.keys(errors).length > 0;

  // useEffect(() => {

  // }, [email, username, firstName, lastName, password, errors])


  const handleDisable = () => {
    if (firstName === "") return true;
    if ( lastName === "") return true;
    if (username.length < 4) return true;
    if (password.length < 6) return true;
    if (password !== confirmPassword) return true;
  }

  // const validateBody = () => {
  //   const tempObj = {};
  //   if (email === "") {
  //     tempObj.email = "Please Provide an email";
  //   }
  //   if (username === "") {
  //     tempObj.username = "Please Provide a username";
  //   }
  //   if (firstName === "") {
  //     tempObj.firstName = "Please Provide a firstname";
  //   }
  //   if (lastName === "") {
  //     tempObj.lastName = "Please Provide a lastname"
  //   }
  //   if (password === "") {
  //     tempObj.password = "Please provide a password"
  //   }
  //   if (confirmPassword === "") {
  //     tempObj.confirmPassword = "Please confirm password"
  //   }
  //   return setErrors(tempObj);
  // }

  console.log("FIRST NAME", firstName)
  console.log("EMAIL", email)
  console.log("ERRORS", errors)
  console.log("ERRORS ARRAY", Object.keys(errors).length)
  // console.log("SUBMIT DISABLED", SubmitDisabled)

  return (
    <div className="signup-form-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>

        <label>
          First Name
          <input
            type="text"
            value={firstName}

            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p>{errors.firstName}</p>}

        <label>
          Last Name
          <input
            type="text"
            value={lastName}

            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p>{errors.lastName}</p>}

        <label>
          Email
          <input
            type="text"
            value={email}

            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p>{errors.email}</p>}
        <label>
          Username
          <input
            type="text"
            value={username}

            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p>{errors.username}</p>}


        <label>
          Password
          <input
            type="password"

            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <label>
          Confirm Password
          <input
            type="password"

            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        <button type="submit" disabled={handleDisable}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;
