import React, {useEffect} from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './SeeAllGroupsPage.css'

import { getAllGroupsThunk } from '../../store/groups';

export default function GetAllGroups(){
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllGroupsThunk())
  },[])


  const groups = useSelector((state) => state)

  console.log("GROUPS" , groups.allGroups)
// if(!groups.allGroups) {
//   return <div>loading</div>
// }

return (

  <>
  <div>Hello</div>


  </>
)



}
