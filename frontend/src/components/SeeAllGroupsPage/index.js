// SeeAllGroupsPage.js
import React, { useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './SeeAllGroupsPage.css'

import { getAllGroupsThunk, addGroupImageThunk } from '../../store/groups';

export default function GetAllGroups() {
  const dispatch = useDispatch()
  const history = useHistory()


  useEffect(() => {
    dispatch(getAllGroupsThunk())


  }, [dispatch])

  const groupSelector = useSelector((state) => state.group.allGroups)

  const groups = Object.values(groupSelector)


  console.log("GET ALL GROUPS", groups)


  const handleGroupClick = (groupId) => {
    history.push(`/groups/${groupId}`)
  }



  return (
    <div className="group-list-container">

      <div className="group-list-header">
        <NavLink to='/events' className="group-list-header" activeClassName='active'>
          Events
        </NavLink>
        <NavLink to='/groups' className="group-list-header" activeClassName='active'>
          Groups
        </NavLink>
      </div>

      <div className="group-list-caption">Groups in Meetup</div>
      {groups.map((group) => (
        <div key={group.id} className="group-list-item" onClick={() => handleGroupClick(group.id)}>

          <div className="group-list-thumbnail">
            <img src={group.previewImage} className='group-list-thumbnail group-list-photo' />
          </div>

          <div className="group-info">

            <div className="group-name">
              {group.name}
            </div>

            <div className="group-location">
              {group.city}
            </div>

            <div className="group-description">
              {group.about}
            </div>

            <div className="group-events-private">
              events · {group.private === false ? 'Public' : 'Private'}
            </div>

          </div>
        </div>
      ))}
    </div>
  )
}
