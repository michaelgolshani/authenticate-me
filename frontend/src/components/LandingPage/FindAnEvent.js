import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './LandingPage.css';
//import eventImage from '../assets/Images/Daco_1979729.png';


function FindAnEvent (){
  return (
    <div>
      <img src="example.jpg" alt="example image" className="landing-page-s3-image" />
      <NavLink to='/events'>
      Find an event
      </NavLink>

    </div>
  )
}


export default FindAnEvent
