import React, { useEffect } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEventsThunk, getEventDetailsThunk, deleteEventThunk } from '../../store/events';
import OpenModalButton from '../OpenModalButton';
import DeleteEventModal from '../DeleteEventModal';
import { getGroupDetailsThunk } from '../../store/groups';
import './GetAllEventDetailsPage.css'
import { useState } from 'react';
import { useModal } from '../../context/Modal';



export default function GetAllEventDetails({ sessionUser }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal()

  const [isLoaded, setIsLoaded] = useState(false); // Add loading state

  let { eventId } = useParams();

  eventId = parseInt(eventId)


  const eventsStateTest = useSelector((state) => state)
  const event = useSelector((state) => state.event.singleEvent)
  const eventAssociatedGroup = useSelector((state) => state.group.currentGroup)



  let groupId = event ? event.groupId : null;

  // console.log("SESSION USER for EVENT DETAILS", sessionUser.id)
  // console.log("GROUP ORGANIZER ID FOR EVENT DETAILS", eventAssociatedGroup.Organizer.id)
  console.log("GROUP ID", groupId)
  console.log("EVENT ID", eventId)
  console.log("STATE FOR EVENT DETAILS PAGE", eventsStateTest)
  console.log("CURRENT EVENT FOR EVENT DETAILS PAGE", event)
  console.log("CURRENT ASSOCIATED GROUP FOR EVENT DETAILS PAGE", eventAssociatedGroup)


  useEffect(() => {
    const getData = async () => {

      try {

        await dispatch(getEventDetailsThunk(eventId))

        await dispatch(getGroupDetailsThunk(groupId))

        setIsLoaded(true);
      } catch (error) {

        console.error('Error for TRY CATCH- GET GROUP DETAILS:', error)
      }
    };

    getData()

  }, [dispatch, eventId, groupId]);


  const handleDeleteEvent = (eventId) => {

  }

  console.log("EVENT FROM GROUP DETIALS PAGE", event)

  if (!eventAssociatedGroup.Organizer) {
    return null

  }


  if (!Object.keys(event).length) {
    return null;
  }

  if (!event.id) {
    return null;
  }

  if (!getEventDetailsThunk)
    // if(event.EventImages[0].url) return null

    if (!sessionUser) return null


  console.log("EVENT- GROUP IMAGES", eventAssociatedGroup.GroupImages)

  return (

    <>
      <div className="event-details-wrapper">



        <div className="events-top-header">
          <NavLink to="/events">Events</NavLink>
          <h1>{event.name}</h1>
          <h3>Hosted by {eventAssociatedGroup.Organizer.firstName} {eventAssociatedGroup.Organizer.lastName}</h3>
        </div>

        
        <div className="event-details-container">
          <div className="event-details-section">
            <div className="event-details-image-container">
              <img src={event?.EventImages[0]?.url}></img>
            </div>
            <div className="event-details-group-details">
              <div className="event-group-details">
                <div className="event-details-group-image">
                  <img src={eventAssociatedGroup?.GroupImages[0]?.url}></img>
                </div>
                <div className="group-event-detail-public">
                  <h1>{event.Group.name}</h1>
                  <p>{event.Group.private ? "Private" : "Public"}</p>
                </div>
              </div>
              <div className="event-details-container">
                <div className="event-details">

                  <div className="event-details-section-time-labels">
                    <div className="clock">🕒</div>
                    <div className="time">
                      <div>Start</div>
                      <div>End</div>
                    </div>
                    <div className="event-details-start-end">
                      <div>{new Date(event.startDate).toDateString()} • {event.startDate.slice(11, 19)}</div>
                      <div>{new Date(event.endDate).toDateString()} • {event.endDate.slice(11, 19)}</div>
                    </div>
                  </div>

                  <div className="event-details-section-price">
                    <div className="dollar">💲</div>
                    <div className="price">${event.price > 0 ? event.price : " Free"}</div>
                  </div>

                  <div className="event-details-section-type">
                    <div className="event-details-type-wrap">
                      <div className="pin">📍</div>
                      <div className="type">{event.type}</div>
                    </div>


                    {sessionUser?.id === eventAssociatedGroup.Organizer?.id &&

                    <div className="delete-button">
                      <OpenModalButton
                        className="group-details-delete-button group-details-button"
                        buttonText="Delete"
                        modalComponent={<DeleteEventModal eventId={eventId}></DeleteEventModal>}
                      />

                      {/* {renderDeleteButton()} */}
                    </div>

                    }

                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="event-details-about">
            <h1>Details</h1>
            <p>{event.description}</p>
          </div>
        </div>



      </div>
    </>




  )


}







// if (!event || !eventAssociatedGroup) {

//   return <div>Loading...</div>;
// }




 // if (!Object.keys(event).length) {
  //   return null;
  // }

  // if (!event.id) {
  //   return null;
  // }
