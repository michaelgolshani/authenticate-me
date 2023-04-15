import React, { useEffect } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEventsThunk } from '../../store/events';
import './GetAllEventsPage.css'
import OpenModalButton from '../OpenModalButton';
import DeleteGroupModal from '../DeleteGroupModal';
import GetAllEventDetails from '../GetAllEventDetailsPage';


export default function GetAllEvents() {
  const dispatch = useDispatch();
  const history = useHistory();

  const stateTest = useSelector((state) => state.event)

  // console.log("STATE TEST FOR GET ALL EVENTS", stateTest)

  const events = useSelector((state) => Object.values(state.event.allEvents));


  useEffect(() => {
    dispatch(getAllEventsThunk())
  }, [dispatch])


  const putEventsinOrder = events.sort((a, b) => Date.parse(b.startDate) - Date.parse(a.startDate));



  const handleEventClick = (eventId) => {
    return history.push(`/events/${eventId}`)
  };

  return (
    <div className="events-list-container">
      <div className="events-list-header">
        <NavLink to='/events' className="events-list-header" activeClassName='active'>
          Events
        </NavLink>
        <NavLink to='/groups' className="events-list-header" activeClassName='active'>
          Groups
        </NavLink>
      </div>
      <div className="events-list-caption">Events in Meetup</div>
      {events.map((event) => (

        <div key={event.id} className="events-list-item" onClick={() => handleEventClick(event.id)}>

          <div className="events-list-thumbnail">
            <img src={event.previewImage} className='events-list-thumbnail events-list-photo' />
          </div>

          <div className="events-list-info">

            <div className="events-list-date-time">
              <p className="events-list-date-time">{new Date(event.startDate).toISOString().slice(0, 10)} • {event.startDate.slice(11, 16)}</p>

            </div>

            <div className="events-name">
              {event.name}
            </div>

            <div className="events-location">
              {event.Group.city}, {event.Group.state}
            </div>
            <div className="events-description">
              {event.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  )

}
