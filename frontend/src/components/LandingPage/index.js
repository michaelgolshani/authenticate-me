import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './LandingPage.css'
 import partyimage from '../../content/images/party.jpg'



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
          <h1>Your one-stop shop to find your <span className="vibe-text">vibe</span>.</h1>
          <p>
            Discover events with like-minded individuals who share your
            VIBE and build meaningful connections that will last a lifetime.
          </p>
        </div>
        <div className="s1-right-container">
          <img src={partyimage} alt="example image" className="s1-party-image" />
        </div>
      </div>
      <div className='s2'>
        <h2 className="h2">
          How JoinVibe Works
        </h2>
        <p className="p2">
          Discover groups, explore events, meet new people, and find your vibe!!
        </p>
      </div>
      <div className='s3'>
        <div className='s3-links'>
          <FindAnEvent />
          <SeeAllGroups />
          <StartANewGroup />
        </div>
      </div>
      <div className='button-div'>
        <button className="join-button">
          Join Meetup
        </button>
      </div>
    </>
  )
}


export default LandingPage
