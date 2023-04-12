import React, { useEffect, useState, useLayoutEffect, useMemo } from "react"
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createGroupThunk } from "../../../store/groups";
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


console.log(currentGroup)


  const validate = () => {
    const errors ={}

    return errors
  }


  const onSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    const errorContent = Object.values(errors);
    if (errorContent.length) return setErrors(errors);

    const groupInfo = {
      location,
      name,
      about,
      type,
      isPrivate,
      image
    };

    console.log(groupInfo);
    setName("");
    setLocation("");
    setAbout("");
    setType("");
    setisPrivate("");
    setImage("");
    setErrors({});
  };




  return (
    <>
 <div className="container">
      <h2>First, set your group's location </h2>
      <form onSubmit={onSubmit}>
      <div className="form-row">
          <label htmlFor="location">City,State: </label>
          <input
            id="location"
            type="text"
            onChange={(e) => setLocation(e.target.value)}
            value={location}
          />
        </div>
        <h2>What will your group's name be?</h2>
        <div className="form-row">
          <label htmlFor="name">Name: </label>
          <input
            id="name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
        </form>
       </div>
    </>
  )
}
