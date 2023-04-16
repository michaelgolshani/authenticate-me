import React, { useEffect } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEventsThunk, getEventDetailsThunk } from '../../store/events';

import OpenModalButton from '../OpenModalButton';
import DeleteGroupModal from '../DeleteGroupModal';
import { getGroupDetailsThunk } from '../../store/groups';


export default function GetAllEventDetails({ sessionUser }) {
  const dispatch = useDispatch();
  const history = useHistory();

  let { eventId } = useParams();

  eventId = parseInt(eventId)


  const eventsStateTest = useSelector((state) => state)
  const event = useSelector((state) => state.event.singleEvent)
  let groupId = event.groupId

  groupId = parseInt(groupId)


  console.log("GROUP ID", groupId)

  const eventAssociatedGroup = useSelector((state) => state.group.currentGroup)

  console.log("STATE FOR EVENT DETAILS PAGE", eventsStateTest)
  console.log("CURRENT EVENT FOR EVENT DETAILS PAGE", event)
  console.log("CURRENT ASSOCIATED GROUP FOR EVENT DETAILS PAGE", eventAssociatedGroup)





  useEffect(() => {
    dispatch(getGroupDetailsThunk(groupId));
    dispatch(getEventDetailsThunk(eventId));
  }, [dispatch]);







  // if (!Object.keys(event).length) {
  //   return null;
  // }

  // if (!event.id) {
  //   return null;
  // }

  return (

    <>
    <div className="events-wrapper">
        <div className="events-navigation">
        <NavLink to="/events">Events</NavLink>
        <h1>{event.name}</h1>
        <h3>Hosted by {eventAssociatedGroup.Organizer.firstName} {eventAssociatedGroup.Organizer.lastName}</h3>
        </div>
        <div className="event-container">
            <div className="first-event-section">
        <div className="event-image-container">
        <img src={event.EventImages[0].url}></img>
        </div>
        <div className="group-event-details">
        <div className="group-details">
            <div className="group-image-container-event">
            <img src={eventAssociatedGroup.GroupImages[0].url}></img>
            </div>
            <div className="group-event-detail-public">
            <h1>{event.Group.name}</h1>
            <p>{event.Group.private ? "Private" : "Public"}</p>
            </div>
        </div>
        <div className="event-details-container">
            <div className="event-details">

                <div className="section-one-event">
                    <div className="clock">🕒</div>
                    <div className="time">
                        <div>Start</div>
                        <div>End</div>
                    </div>
                    <div className="start-end">
                        <div>{new Date(event.startDate).toDateString()} • {event.startDate.slice(11, 19)}</div>
                        <div>{new Date(event.endDate).toDateString()} • {event.endDate.slice(11,19)}</div>
                    </div>
                </div>

                <div className="section-two-event">
                    <div className="dollar">💲</div>
                    <div className="price">${event.price > 0 ? event.price : " Free"}</div>
                </div>

                <div className="section-three-event">
                    <div className="type-wrap">
                    <div className="pin">📍</div>
                    <div className="type">{event.type}</div>
                    </div>
                    <div className="button-cont">
                    {/* {renderDeleteButton()} */}
                    </div>
                </div>
            </div>
        </div>
        </div>
        </div>
        <div className="about-wrapper-event">
        <h1>Details</h1>
        <p>{event.description}</p>
        </div>
        </div>
    </div>
   </>
)




}
