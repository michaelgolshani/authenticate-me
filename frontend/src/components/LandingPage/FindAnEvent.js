import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './LandingPage.css';
//import eventImage from '../assets/Images/Daco_1979729.png';


function FindAnEvent (){
  return (
    <div className='s3-column'>
      <img src="https://edm.com/.image/t_share/MTY1NzI5MTM2NjY3NTM1Mjgz/parookaville-sunset-stage-view.jpg" alt="example image" className="landing-page-s3-image" />
      <NavLink to='/events' className="s3-nav-link">
      Find an event
      </NavLink>

    </div>
  )
}


export default FindAnEvent
