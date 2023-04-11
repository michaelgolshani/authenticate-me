import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav className="navigation-container">
      <ul className="navigation-list">
        <li className="navigation-item">
          <NavLink exact to="/" className="navigation-link">Home</NavLink>
        </li>
        {isLoaded && (
          <li className="navigation-item navigation-item-right">
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
