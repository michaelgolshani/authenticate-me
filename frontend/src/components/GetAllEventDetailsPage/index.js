import React, { useEffect } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';



export default function GetAllEventDetails({sessionUser}) {

  const dispatch = useDispatch()
  const history = useHistory()
  let {groupId} = useParams()

  groupdId = parseInt(groupId)
  console.log(groupId)








}
