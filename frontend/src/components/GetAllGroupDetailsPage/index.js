import React, { useEffect } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getAllGroupsThunk, getGroupDetailsThunk } from '../../store/groups';
import './GetAllGroupDetails.css'



export default function GetAllGroupDetails({ sessionUser }) {
  const dispatch = useDispatch()
  const history = useHistory()
  let { groupId } = useParams()
  groupId = parseInt(groupId)
  console.log(groupId)


  useEffect(() => {
    // dispatch(getAllGroupsThunk())
    dispatch(getGroupDetailsThunk(groupId))
  }, [dispatch, groupId])

  const group = useSelector((state) => state.group.currentGroup)

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

  return (
    <div>
      <NavLink to='/groups' className="groups-link" >
        Groups
      </NavLink>
      <div className="group-image">
        <img src={group.GroupImages[0]?.url} alt="example image" />
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

          <button className="action-button">
            Create event
          </button>

          <button className="action-button"  onClick= {() => history.push(`/groups/${groupId}/edit`)}>
            Update
          </button>

          <button className="action-button" >
            Delete
          </button>
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
