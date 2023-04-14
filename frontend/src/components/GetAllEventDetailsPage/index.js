import React, { useEffect } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';



export default function GetAllEventDetails({sessionUser}) {

  const dispatch = useDispatch()
  const history = useHistory()


  // groupdId = parseInt(groupId)
  console.log(groupId)

  const event = useSelector((state) => state.events.singleEvent);
  const eventsGroup = useSelector((state) => state.groups.singleGroup);
  const groupId = event.groupId;



  useEffect(() => {
    dispatch(getEventDetails(eventId));
}, [dispatch]);





}
