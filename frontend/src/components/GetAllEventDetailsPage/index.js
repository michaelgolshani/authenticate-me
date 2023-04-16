import React, { useEffect } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEventsThunk, getEventDetailsThunk } from '../../store/events';

import OpenModalButton from '../OpenModalButton';
import DeleteGroupModal from '../DeleteGroupModal';
import { getGroupDetailsThunk } from '../../store/groups';
import './GetAllEventDetailsPage.css'

export default function GetAllEventDetails({ sessionUser }) {
  const dispatch = useDispatch();
  const history = useHistory();

  let { eventId } = useParams();

  eventId = parseInt(eventId)


  const eventsStateTest = useSelector((state) => state)
  const event = useSelector((state) => state.event.singleEvent)
  let groupId = event.groupId

  groupId = parseInt(groupId)


  useEffect(() => {
    dispatch(getGroupDetailsThunk(groupId));
    dispatch(getEventDetailsThunk(eventId));
  }, [dispatch,groupId,eventId]);



  console.log("GROUP ID", groupId)

  const eventAssociatedGroup = useSelector((state) => state.group.currentGroup)

  console.log("STATE FOR EVENT DETAILS PAGE", eventsStateTest)
  console.log("CURRENT EVENT FOR EVENT DETAILS PAGE", event)
  console.log("CURRENT ASSOCIATED GROUP FOR EVENT DETAILS PAGE", eventAssociatedGroup)












  if (!Object.keys(event).length) {
    return null;
  }

  if (!event.id) {
    return null;
  }

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
        <img src={event.EventImages[0].url}></img>
        </div>
        <div className="event-details-group-details">
        <div className="event-group-details">
            <div className="event-details-group-image">
            <img src={eventAssociatedGroup.GroupImages[0].url}></img>
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
                        <div>{new Date(event.endDate).toDateString()} • {event.endDate.slice(11,19)}</div>
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
                    <div className="button-cont">
                    {/* {renderDeleteButton()} */}
                    </div>
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
