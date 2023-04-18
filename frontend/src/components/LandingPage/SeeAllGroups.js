import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './LandingPage.css';
//import eventImage from '../assets/Images/Daco_1979729.png';


function SeeAllGroups (){
  return (
    <div className='s3-column'>
      <img src="https://st.depositphotos.com/1594308/3891/i/950/depositphotos_38918103-stock-photo-group-of-friends-at-party.jpg" alt="example image" className="landing-page-s3-image" />
      <NavLink to='/groups' className="s3-nav-link">
      See all groups
      </NavLink>

    </div>
  )
}


export default SeeAllGroups
