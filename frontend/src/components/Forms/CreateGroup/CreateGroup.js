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
  console.log("CURRENT GROUP STATE", currentGroup)



  
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("");
  const [isPrivate, setisPrivate] = useState("");
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState({});


  console.log(currentGroup)

  const validate = () => {
    const errors = {}
    if (!location) {
      errors.location = "Location is required";
    }

    if (!name) {
      errors.name = "Name is required";
    }

    if (!about || about.length < 30) {
      errors.about = "About must be at least 30 characters long";
    }

    if (!type) {
      errors.type = "Group Type is required";
    }

    if (!isPrivate) {
      errors.isPrivate = "Visibility Type is required";
    }

    if (image) {
      const fileExtension = image.split('.').pop().toLowerCase();
      const validExtensions = ['jpg', 'png', 'jpeg'];
      if (!validExtensions.includes(fileExtension)) {
        errors.image = "Image URL needs to end in .png, .jpg or .jpeg";
      }
    }

    console.log("ERRORS", errors)
    return errors;
  }



  const OnSubmit = (e) => {
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

    console.log("GROUP INFO", groupInfo);
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
      <div className="create-group-container">
        <h2 className="create-group-top-header">We'll walk you through a few steps to build your local community</h2>



        <h2 className="create-group-h2">First, set your group's location </h2>
        <p>Joinup groups meet locally, in person and online. We'll connect you with people
          in your area, and more can join you online.</p>
        <form onSubmit={OnSubmit}>
          <div className="create-group-form-row">
            <label htmlFor="location"></label>
            <input
              className="create-group-label-input"
              placeholder="City,State"
              id="location"
              type="text"
              onChange={(e) => setLocation(e.target.value)}
              value={location}
            />
            {errors.location && <p className="error">{errors.location}</p>}

          </div>



          <h2 className="create-group-h2">What will your group's name be?</h2>
          <p>Choose a name that will give people a clear idea of what the group is about.
            Feel free to get creative! You can edit this later if you change your mind.</p>
          <div className="create-group-form-row">
            <label htmlFor="name"></label>
            <input
              className="create-group-label-input"
              placeholder="What is your group name?"
              id="name"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />

            {errors.name && <p className="error">{errors.name}</p>}

          </div>

          <h2 className="create-group-h2">Now describe what your group will be about</h2>
          <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>

          <p>1. What's the purpose of the group?</p>
          <p>2. Who should join?</p>
          <p>3. What will you do at your events?</p>

          <div className="create-group-form-row">
            <label htmlFor="about"></label>
            <input
              className="create-group-label-about"
              placeholder="Please write at least 30 characters"
              id="about"
              type="text"
              onChange={(e) => setAbout(e.target.value)}
              value={about}
            />
            {errors.about && <p className="error">{errors.about}</p>}

          </div>


          <h2 className="create-group-h2">Final steps...</h2>


          <div className="create-group-form-row">
            <p>Is this an in person or online group?</p>
            <select
              name="type"
              onChange={(e) => setType(e.target.value)}
              value={type}
            >
              <option value="" disabled>
                (select one)
              </option>
              {["In person", "Online"].map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>

            {errors.type && <p className="error">{errors.type}</p>}

          </div>


          <div className="create-group-form-row">
            <p>Is this group private or public?</p>
            <select
              name="isPrivate"
              onChange={(e) => setisPrivate(e.target.value)}
              value={isPrivate}
            >
              <option value="" disabled>
                (select one)
              </option>
              {["Private", "Public"].map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>

            {errors.isPrivate && <p className="error">{errors.isPrivate}</p>}

          </div>


          <p>Please add an image for your group below </p>
          <div className="create-group-form-row">
            <label htmlFor="imageUrl"></label>
            <input
              className="create-group-label-input"
              placeholder="Image Url"
              id="image"
              type="text"
              onChange={(e) => setImage(e.target.value)}
              value={image}
            />

            {errors.image && <p className="error">{errors.image}</p>}

          </div>

          <button>
            Create Group
          </button>


        </form>
      </div>
    </>
  )
}
