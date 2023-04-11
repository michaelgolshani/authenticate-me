import React, { useEffect } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getAllGroupsThunk, getGroupDetails } from '../../store/groups';
import './GetAllGroupDetails.css'



export default function GetAllGroupDetails() {
  const dispatch = useDispatch()
  const history = useHistory()

  const {groupId} = useParams()



  useEffect(() => {
    // dispatch(getAllGroupsThunk())
    dispatch(getGroupDetails(groupId))
  }, [dispatch, groupId])



  const groupSelector = useSelector((state) => state.group.allGroups)
  const groups = Object.values(groupSelector)




  // const handleGroupClick = (groupId) => {
  //   history.push(`/groups/${groupId}`)
  // }


  return (
    <>



    </>

  )
}
