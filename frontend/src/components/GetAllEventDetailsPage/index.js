import React, { useEffect } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEventsThunk } from '../../store/events';

import OpenModalButton from '../OpenModalButton';
import DeleteGroupModal from '../DeleteGroupModal';


export default function GetAllEventDetails({sessionUser}) {
  const dispatch = useDispatch();
  const history = useHistory();

  let {eventId} = useParams();

  eventId = parseInt(eventId)


  const eventsGroup = useSelector((state) => state.group.singleGroup)
  const event = useSelector((state) => state.events.singleEvent)
  const groupId = event.groupId

  useEffect(() => {
    // dispatch(getEventDetails(eventId));
}, [dispatch]);


if(!Object.keys(event).length) {
  return null;
}

if(!event.id){
  return null;
}



}
