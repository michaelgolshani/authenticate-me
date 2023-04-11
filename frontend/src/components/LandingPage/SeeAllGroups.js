import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './LandingPage.css';
//import eventImage from '../assets/Images/Daco_1979729.png';


function SeeAllGroups (){
  return (
    <div>
      <img src="example.jpg" alt="example image" className="s3-image" />
      <NavLink to='/groups'>
      See all groups
      </NavLink>

    </div>
  )
}


export default SeeAllGroups
