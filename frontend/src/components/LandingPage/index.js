import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './LandingPage.css'

import FindAnEvent from './FindAnEvent';
import SeeAllGroups from './SeeAllGroups';
import StartANewGroup from './StartANewGroup';
// import './LandingPage.css';
// import flowerImage from '../assets/Images/Example.jpg';
// import landingPageInfo from '../assets/Images/pngfind.com-hora-de-aventura-png-6738376.png';



function LandingPage() {
  return (
    <>
      <div className="container">
        <div className="s1-left-container">
          <h1>The people platform. Where interests become friendships.</h1>
          <p>
            Come FIND your vibe. Discover like-minded individuals who share your
            VIBE and build meaningful connections that turn into lifelong
            friendships.
          </p>
        </div>
        <div className="s1-right-container">
          <img src="example.jpg" alt="example image" className="s1-example-image" />
        </div>
      </div>
      <div className='s2'>
        <h2>
          How JoinVibe Works
        </h2>
        <p>
          Join your tribe. Find your vibe!!
        </p>
      </div>
      <div className='s3'>
        <div className='s3-links'>
        <FindAnEvent />
        <SeeAllGroups />
        <StartANewGroup/>
        </div>
      </div>
    </>
  )
}


export default LandingPage
