import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './SeeAllGroupsPage.css'

import { getAllGroupsThunk } from '../../store/groups';

export default function GetAllGroups() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllGroupsThunk())
  }, [dispatch])


  const groupSelector = useSelector((state) => state.group.allGroups)

  console.log("GROUPS", groupSelector)
  // if(!groups.allGroups) {
  //   return <div>loading</div>
  // }

  const groups = Object.values(groupSelector)

  console.log("groups", groups)
  return (

    <>
      <div>
        <div>Events</div>
        <div>Groups</div>
        {
          groups.map((group) => (
            <>
              <div className='group-elements'>
                <div>{group.name}</div>
                <div>{group.city}</div>
                <div>{group.about}</div>
              </div>
            </>
          ))
        }
      </div>


    </>
  )



}
