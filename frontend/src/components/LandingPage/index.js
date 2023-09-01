import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './LandingPage.css'
import partyimage from '../../content/images/party.jpg'
import FindAnEvent from './FindAnEvent';
import SeeAllGroups from './SeeAllGroups';
import StartANewGroup from './StartANewGroup';
import SignupFormModal from '../SignupFormModal';
import OpenModalButton from '../OpenModalButton';



function LandingPage({ sessionUser }) {
  const history = useHistory()

  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)

  const openModal = () => {
    setIsSignUpModalOpen(true)
  }

  const openSignUpForm = () => {
    return (
      <div>
        <SignupFormModal />
      </div>
    )
  }

  return (
    <>
      <div className="landing-page-container">
        <div className='landing-page-s1'>
          <div className="landing-page-s1-left-container">
            <h1 className='landing-page-s1-left-container-description' >Your one-stop shop to find your <span className="landing-page-vibe-text">vibe</span>.</h1>
            <p>
              Discover events with like-minded individuals who share your
              VIBE and build meaningful connections that will last a lifetime.
            </p>
          </div>
          <div className="landing-page-s1-right-container">
            <img src={partyimage} alt="example image" className="landing-page-s1-party-image" />
          </div>
        </div>

        <div className='landing-page-s2'>
          <h2 className="landing-page-h2">
            How JoinVibe Works
          </h2>
          <p className="landing-page-p2">
            Discover groups, explore events, meet new people, and find your vibe!!
          </p>
        </div>

        <div className='landing-page-s3'>
          <SeeAllGroups />
          <FindAnEvent />
          <StartANewGroup sessionUser={sessionUser} />
        </div>

        {!sessionUser && (
          <>
            <div className='landing-page-button-div'>
              <button className="landing-page-join-button"
                onClick={openModal}>
                Join Meetup
              </button>
            </div>

            {/* <div>
              <OpenModalButton
                // className='form-button-nav'
                buttonText="Sign Up"
                modalComponent={<SignupFormModal />}
              />
            </div> */}
          </>
        )}





      </div>
    </>
  )
}


export default LandingPage
