import React, { useEffect, useState } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSearchNames, setFilteredSearchNames] = useState([]);

  const stateTest = useSelector((state) => state.event)

  // console.log("STATE TEST FOR GET ALL EVENTS", stateTest)

  const events = useSelector((state) => Object.values(state.event.allEvents));


  useEffect(() => {
    dispatch(getAllEventsThunk())
  }, [dispatch])



  const newEvents = (events) => {
    return events.filter(event => {
      if (Date.parse(event.startDate) >= Date.now()) {
        return true
      }
    })
  }

  const upcomingEvents = newEvents(events)
  console.log("UPCOMING EVENTS", upcomingEvents)

  upcomingEvents.sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate));


  const pastEvents = events.filter(event => !upcomingEvents.includes(event));
  pastEvents.sort((a, b) => Date.parse(b.startDate) - Date.parse(a.startDate));

  console.log("PAST EVENTS", pastEvents)
  console.log("FILTERED GROUP NAMES", filteredSearchNames)
  console.log("SEARC TERM", searchTerm)
  console.log("SEARCH QUERY", searchQuery)




  const handleEventClick = (eventId) => {
    return history.replace(`/events/${eventId}`)
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("SUBMITTING")
    setSearchQuery(searchTerm)

    const filteredEvents = events.filter((event) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        event.name.toLowerCase().includes(searchTermLower) ||
        event.Venue.city.toLowerCase().includes(searchTermLower) ||
        event.Venue.state.toLowerCase().includes(searchTermLower)
      );
    });

    setFilteredSearchNames(filteredEvents)
    setSearchTerm('')
    // setSearchQuery('')
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


        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='details-page-search-input'
          />
          <button type="submit">Search</button>
        </form>



      </div>
      <div className="events-list-caption">Events in Meetup</div>
      {searchQuery ? (
        filteredSearchNames.map((event) => (
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
        ))
      ) :
        (
          <>
            {upcomingEvents.map((event) => (
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
            {pastEvents.map((event) => (
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
          </>
        )}
    </div>
  );


}
