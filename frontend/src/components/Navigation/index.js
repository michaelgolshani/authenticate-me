import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import OpenModalButton from '../OpenModalButton';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav className="nav-container">
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink exact to="/" >
          <img src="joinvibe.jpg" alt="JoinVibe logo" className="s1-joinvibe-logo" />
          </NavLink>
        </li>
        {isLoaded && (
          <li className="nav-item nav-item-right">
            <li className='nav-button'>
              <OpenModalButton
                buttonText="Log In"

                modalComponent={<LoginFormModal />}
              />
            </li>
            <li className='nav-button'>
              <OpenModalButton
                buttonText="Sign Up"

                modalComponent={<SignupFormModal />}
              />
            </li>
            <div className="nav-button">
            <ProfileButton user={sessionUser}  />
            </div>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
