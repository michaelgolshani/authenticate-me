import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import OpenModalButton from '../OpenModalButton';
import logo from '../../content/images/logo.png'

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav className="nav-container">
      <ul className="nav-list">
        {/* <li className="nav-item"> */}
          <NavLink exact to="/" >
            <img src={logo} alt="JoinVibe logo" className="s1-joinvibe-logo" />
          </NavLink>
        {/* </li> */}
        {isLoaded && (
          <>


            {sessionUser ? (
              <div>
                <NavLink exact to="/groups/new" className="nav-start-a-group">Start a new group</NavLink>
                <div className="nav-button">
                  <ProfileButton user={sessionUser} />
                </div>
              </ div>
            ) : (
              <>

                <div className='nav-button'>
                  <OpenModalButton
                    buttonText="Log In"
                    modalComponent={<LoginFormModal />}
                    className='form-button-nav'
                  />
                </div>
                <div className='nav-button'>
                  <OpenModalButton
                    className='form-button-nav'
                    buttonText="Sign Up"
                    modalComponent={<SignupFormModal />}
                  />
                </div>
              </>
            )}
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
