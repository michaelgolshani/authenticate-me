import React, { useEffect, useState, useLayoutEffect, useMemo } from "react"
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createGroupAction, createGroupImageAction, updateGroupAction, updateGroupImageAction, getGroupDetails } from "../../../store/groups";
import './CreateGroup.css';

export default function CreateGroup({ update, sessionUser }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();
  let { groupId } = params;
  groupId = parseInt(groupId);

  const currentGroup = useSelector((state) => state.group.singleGroup);
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("");
  const [isPrivate, setisPrivate] = useState("");
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState({});






  return (
    <>
    </>
  )
}
