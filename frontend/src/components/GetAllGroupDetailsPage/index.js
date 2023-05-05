import React, { useEffect } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllGroupsThunk, getGroupDetailsThunk } from '../../store/groups';
import { getGroupEventsThunk } from '../../store/events';

import './GetAllGroupDetails.css'
import OpenModalButton from '../OpenModalButton';
import DeleteGroupModal from '../DeleteGroupModal';



const GetAllGroupDetails = React.memo(({ sessionUser }) => {
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
  if (isNaN(groupId)) {
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





  const newEvents = (eventsArr) => {
    return eventsArr.filter(event => {
      if (Date.parse(event.startDate) >= Date.now()) {
        return true
      }
    })
  }

  console.log("NEW EVENTS", newEvents(eventsArr))


  const upcomingEvents = newEvents(eventsArr)
  console.log("UPCOMING EVENTS", upcomingEvents)

  upcomingEvents.sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate));


  const pastEvents = eventsArr.filter(event => !upcomingEvents.includes(event));
  pastEvents.sort((a, b) => Date.parse(b.startDate) - Date.parse(a.startDate));

  console.log("PAST EVENTS", pastEvents)


  //if clicked, go to event details
  const eventDetails = (eventId) => {
    return history.push(`/events/${eventId}`)
  }







  return (
    <div>




      <div className='get-all-group-details-container'>




        <NavLink to='/groups' className="group-details-groups-link" >
          Groups
        </NavLink>


        <div className='get-all-group-details-top-container'>


          <div className='get-all-group-details-top-container-row'>

            <div className="group-details-group-image">
              <img src={group.GroupImages[0]?.url} alt="group image" className='group-details-group-image' />
              {/* {group.GroupImages.map((image, index) => {
          if (image.preview === true) {
            return <img src={image.url} alt={`group image ${index}`} key={index} />;
          }
          return null;
        })} */}
            </div>

            <div className="group-details-wrapper">
              <h2 className="group-details-group-name">{group.name}</h2>
              <div className="group-details-group-info">
                <p>
                  {group.city}, {group.state}
                </p>
                <p>
                  {group.private ? 'Private' : 'Public'}
                </p>
                <p>
                  Organized by {group.Organizer.firstName} {group.Organizer.lastName}
                </p>


                <button className="group-details-button" onClick={() => history.push(`/groups/${groupId}/events/new`)}>
                  Create event
                </button>

                <button className="group-details-button" onClick={() => history.push(`/groups/${groupId}/edit`)}>
                  Update
                </button>


                <OpenModalButton
                  className="group-details-button"
                  buttonText="Delete"
                  modalComponent={<DeleteGroupModal groupId={groupId}></DeleteGroupModal>}
                />


              </div>

            </div>

          </div>

        </div>




        <div className="group-details-organizer-details">
          <h2 className="group-details-organizer">Organizer</h2>
          <p className="group-details-organizer-name">
            {group.Organizer.firstName} {group.Organizer.lastName}
          </p>


          <div className="group-details-about-section">
            <h2 className="group-details-about-header">What we're about</h2>
            <p className="group-details-about-info">{group.about}</p>
          </div>



          {upcomingEvents.length > 0 && (
            <>
              <h2 className="group-details-events-header">
                Upcoming Events {`(${upcomingEvents.length})`}
              </h2>

              {upcomingEvents.map(event => (

                <div onClick={() => eventDetails(event.id)}>
                  <div key={event.id} className='whole-containter-event-details'>
                    <div className="group-details-event-container">



                      <div className="group-details event-image">
                        <img className="event-image" src={event.previewImage} />
                      </div>


                      <div className="group-details-event-details">
                        <div className="inside-event-details group-details-event-date-time">
                          <p>{new Date(event.startDate).toISOString().slice(0, 10)} • {event.startDate.slice(11, 16)}</p>
                        </div>

                        <div className="inside-event-details group-details-event-name">
                          <h3>{event.name}</h3>
                        </div>

                        <div className="inside-event-details group-details-event-location">
                          <p>{event.location}</p>
                        </div>

                        <div className="inside-event-details group-details-event-about">
                          <p>{`${event.Venue.city}, ${event.Venue.state}`}</p>
                        </div>
                      </div>


                    </div>

                    <div className="inside-event-details">
                      <p>{event.description}</p>
                    </div>


                  </div>
                </div>

              ))}


            </>
          )}



          {pastEvents.length > 0 && (
            <>
              <h2 className="group-details-events-header">
                Past Events {`(${pastEvents.length})`}
              </h2>

              {pastEvents.map(event => (

                <div onClick={() => eventDetails(event.id)}>
                  <div key={event.id} className='whole-containter-event-details'>
                    <div className="group-details-event-container">



                      <div className="group-details event-image">
                        <img className="event-image" src={event.previewImage} />
                      </div>


                      <div className="group-details-event-details">
                        <div className="inside-event-details group-details-event-date-time">
                          <p>{new Date(event.startDate).toISOString().slice(0, 10)} • {event.startDate.slice(11, 16)}</p>
                        </div>

                        <div className="inside-event-details group-details-event-name">
                          <h3>{event.name}</h3>
                        </div>

                        <div className="inside-event-details group-details-event-location">
                          <p>{event.location}</p>
                        </div>

                        <div className="inside-event-details group-details-event-about">
                          <p>{`${event.Venue.city}, ${event.Venue.state}`}</p>
                        </div>
                      </div>


                    </div>

                    <div className="inside-event-details">
                      <p>{event.description}</p>
                    </div>


                  </div>



                  </div>

                ))}


            </>
          )}



          {/* {pastEvents.length > 0 && (
            <>
              <h2 className="group-details-events-header">
                Past Events {`(${pastEvents.length})`}
              </h2>
              <div onClick={eventDetails}>
                {pastEvents.map(event => (
                  <div key={event.id} className="group-details-event-container">
                    <div className="group-details event-image">

                    </div>
                    <div className="group-details-event-details">

                      <div className="group-details-event-date-time">
                        <p>{new Date(event.startDate).toISOString().slice(0, 10)} • {event.startDate.slice(11, 16)}</p>

                      </div>
                      <div className="group-details-event-name">
                        <h3>{event.name}</h3>

                      </div>
                      <div className="group-details-event-location">
                        <p>{event.location}</p>

                      </div>

                      <div className="group-details-event-about">
                        <p>{event.description}</p>

                      </div>
                    </div>
                  </div>
                ))}

              </div>
            </>
          )} */}







        </div>
      </div>

    </div>
  );

})

export default GetAllGroupDetails;
