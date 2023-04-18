import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './LandingPage.css';
//import eventImage from '../assets/Images/Daco_1979729.png';


function StartANewGroup (){
  return (
    <div className='s3-column'>
      <img src="https://media.istockphoto.com/id/535403859/photo/dancing-at-disco.jpg?s=612x612&w=0&k=20&c=mVZX9qAsgnOv8C0t9gR81ofJ0JG20Orc4Io9r4AKNQQ=" alt="example image" className="landing-page-s3-image" />
      <NavLink to='/groups/new' className="s3-nav-link">
      Start a new group
      </NavLink>

    </div>
  )
}


export default StartANewGroup
