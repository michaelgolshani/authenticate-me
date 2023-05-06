import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './LandingPage.css';
//import eventImage from '../assets/Images/Daco_1979729.png';


function StartANewGroup({ sessionUser }) {

  console.log("SESSION USER from START A NEW GROUP", sessionUser)

  console.log("SESSION USER TRUE OR FALSE", sessionUser === true )



  const navLinkClassName = sessionUser ? "s3-nav-link" : "s3-nav-link-disabled";

  


  return (
    <div className='s3-column'>
      <img src="https://media.istockphoto.com/id/535403859/photo/dancing-at-disco.jpg?s=612x612&w=0&k=20&c=mVZX9qAsgnOv8C0t9gR81ofJ0JG20Orc4Io9r4AKNQQ=" alt="example image" className="landing-page-s3-image" />
      <NavLink to='/groups/new' className={navLinkClassName} disabled={!sessionUser}>
        Start a new group
      </NavLink>

    </div>
  )
}


export default StartANewGroup
