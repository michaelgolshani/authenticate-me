import React, { useEffect } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllGroupsThunk, getGroupDetailsThunk } from '../../store/groups';
import { getGroupEventsThunk } from '../../store/events';

import './GetAllGroupDetails.css'
import OpenModalButton from '../OpenModalButton';
import DeleteGroupModal from '../DeleteGroupModal';



export default function GetAllGroupDetails({ sessionUser }) {
  const dispatch = useDispatch()
  const history = useHistory()
  let { groupId } = useParams()
  groupId = parseInt(groupId)
  console.log(groupId)


  useEffect(() => {
    // dispatch(getAllGroupsThunk())
    dispatch(getGroupDetailsThunk(groupId))
    dispatch(getGroupEventsThunk(groupId))
  }, [dispatch])

  const group = useSelector((state) => state.group.currentGroup)
  const events = useSelector((state) => state.event)
  const eventsArr = useSelector((state) => Object.values(state.event.allEvents))
  console.log("GET GROUP DETAIL EVENTS STATE", events)
  console.log("GET GROUP DETAIL ALL EVENTS ARR STATE", eventsArr)

  if (!group.id) {
    return null;
  }

  console.log("CURRENT GROUP SELECTOR", group)


  // const handleGroupClick = (groupId) => {
  //   history.push(`/groups/${groupId}`)
  // }

  // Sort events by date
  //  const sortedEvents = group.Events.sort((a, b) => {
  //   const dateA = new Date(a.date);
  //   const dateB = new Date(b.date);
  //   return dateA - dateB;
  // });


  // GET ALL EVENTS





  const upcomingEvents = (eventsArr) => {
    return eventsArr.filter(event => {
      if (Date.parse(event.startDate) >= Date.now()) {
        return true
      }
    })
  }

  console.log("UPCOMING EVENTS", upcomingEvents(eventsArr))





  //if clicked, go to event details
  const eventDetails = (event) => {
    return history.replace(`/events/${event.id}`)
  }





  return (
    <div className='get-all-group-details-container'>
      <NavLink to='/groups' className="groups-link" >
        Groups
      </NavLink>
      <div className="group-image">
        <img src={group.GroupImages[0]?.url} alt="group image" className='group-image' />
        {/* {group.GroupImages.map((image, index) => {
          if (image.preview === true) {
            return <img src={image.url} alt={`group image ${index}`} key={index} />;
          }
          return null;
        })} */}
      </div>
      <div className="group-details-wrapper">
        <h2 className="group-name">{group.name}</h2>
        <div className="group-info">
          <p>
            {group.city}, {group.state}
          </p>
          <p>
            {group.private ? 'Private' : 'Public'}
          </p>
          <p>
            Organized by {group.Organizer.firstName} {group.Organizer.lastName}
          </p>

          <button className="group-details-button">
            Create event
          </button>

          <button className="group-details-button" onClick={() => history.push(`/groups/${groupId}/edit`)}>
            Update
          </button>


          <OpenModalButton
            className="group-details-delete-button group-details-button"
            buttonText="Delete"
            modalComponent={<DeleteGroupModal groupId={groupId}></DeleteGroupModal>}
          />


        </div>

      </div>

      <div className="organizer-details">
        <h3 className="organizer">Organizer</h3>
        <p className="organizer-name">
          {group.Organizer.firstName} {group.Organizer.lastName}
        </p>
      </div>

      <div className="about-section">
        <h3 className="about-header">What we're about</h3>
        <p className="about-info">{group.about}</p>
      </div>


      <h2 className="events-header">
        Upcoming Events
      </h2>


    </div>
  );

}
