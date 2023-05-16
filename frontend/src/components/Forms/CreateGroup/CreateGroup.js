import React, { useEffect, useState, useLayoutEffect, useMemo } from "react"
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createGroupThunk, updateGroupThunk, getGroupDetailsThunk, addGroupImageThunk, updateGroupImageThunk } from "../../../store/groups";
import './CreateGroup.css';

export default function CreateGroup({ sessionUser, updateGroup }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();
  let { groupId } = params;
  groupId = parseInt(groupId);



  // useEffect(() => {
  //   dispatch(createGroupThunk())
  // }, [dispatch])

  const currentGroup = useSelector((state) => state.group.singleGroup);
  console.log("CURRENT GROUP on CREATE/UPDATE Groups", currentGroup)



  const checkState = useSelector((state) => state)
  console.log("CURRENT GROUP STATE", currentGroup)
  console.log("CHECK STATE", checkState)


  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("");
  const [isPrivate, setisPrivate] = useState("");
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState({});





  useEffect(() => {
    dispatch(getGroupDetailsThunk(groupId));
    if (updateGroup) {
      console.log("CHECK STATE IN UPDATE DISPATCH", checkState)
      console.log("CURRENT GROUP IN UPDATE DISPATCH", checkState.group.currentGroup)

      const oldGroup = checkState.group.currentGroup

      setLocation(`${oldGroup.city}, ${oldGroup.state}`);
      setName(oldGroup.name);
      setAbout(oldGroup.about);
      setType(oldGroup.type);
      setisPrivate(oldGroup.private === true ? "Private" : "Public");
      if (oldGroup.GroupImages.length > 0) {
        setImage(oldGroup.GroupImages[0].url);
      }
    }
  }, [])


  useEffect(() => {
    validate();
  }, [location, name, about, type, isPrivate, image]);


  const updateStateGroup = useSelector((state) => state)

  console.log("UPDATED STATE GROUP", updateStateGroup)


  console.log("CURRENT GROUP", currentGroup)


  const validate = () => {
    const errors = {}

    // have to check to see if state is there. Post project addition
    if (!location) {
      errors.location = "Location is required";
    } else {

      const separateLocationbyComma = location.split(",");

      if (separateLocationbyComma.length !== 2) {
        errors.location = "State is required";
      }
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
      const checkLast = ['jpg', 'png', 'jpeg'];
      if (!checkLast.includes(fileExtension)) {
        errors.image = "Image URL needs to end in .png, .jpg or .jpeg";
      }
    }

    console.log("ERRORS", errors)
    return errors;
  }



  const OnSubmit = async (e) => {

    e.preventDefault();
    const errors = validate();
    const errorContent = Object.values(errors);
    if (errorContent.length) return setErrors(errors);




    //CLEANING UP INPUT FROM USER FOR BACKEND
    //-------------------------------------------------------------------------------------------

    const removeSpacesLoc = location.replaceAll(' ', '')
    const seperateCommaLoc = location.split(',')
    console.log("SEPERATE LOCATION BY COMMA", seperateCommaLoc)

    const seperatedCity = seperateCommaLoc[0]
    const seperatedState = seperateCommaLoc[1]
    console.log("SEPERATE CITY FROM USER INPUT", seperatedCity)
    console.log("SEPERATE STATE FROM USER INPUT", seperatedState)



    if (!seperatedState) {
      errors.location = "state is required"
      return null
    }


    //We need to handle "Person" and "Online" choice. So we will convert the choice to a boolean of true or false
    const convertToBoolean = (input) => {
      if (input === "Private") {
        return true
      } else {
        return false
      }
    }

    //-------------------------------------------------------------------------------------------


    const groupInfo = {
      city: seperatedCity,
      state: seperatedState,
      name,
      about,
      type,
      private: convertToBoolean(isPrivate),

    };

    const addImage = { url: image, preview: true }



    console.log("GROUP INFO", groupInfo);

    const oldGroup = checkState.group.currentGroup
    console.log("CURRENT GROUP ID", oldGroup.id)
    let createGroup;


    // Need to check if we are on the update page or on a create page. Use the prop.

    if (updateGroup) {
      const editedGroup = await dispatch(updateGroupThunk(groupInfo, oldGroup.id))
      // console.log("CURRENT GROUP CHECK IMAGE", currentGroup)

      if (image) {
        await dispatch(updateGroupImageThunk(editedGroup.id, addImage))
      }
      // if (currentGroup.GroupImages) {
      //   console.log("EDITED GROUP CHECK", editedGroup)
      //   await dispatch(updateGroupImageThunk(currentGroup.GroupImages[0].id, addImage))
      // }

      console.log("EDITED GROUP HISTORY PUSH", editedGroup)
      history.push(`/groups/${oldGroup.id}`)

    } else if (!updateGroup) {
      const createGroup = await dispatch(createGroupThunk(groupInfo));
      await dispatch(addGroupImageThunk(createGroup.id, addImage))
      console.log("CREATE GROUP HISTORY PUSH", createGroup)
      history.push(`/groups/${createGroup.id}`)
    }
    console.log("CREATE GROUP DISPATCH", createGroup)
    // setName("");
    // setLocation("");
    // setAbout("");
    // setType("");
    // setisPrivate("");
    // setImage("");
    // setErrors({});
  };








  return (
    <>
      <form onSubmit={OnSubmit}>
        <div className="create-group-container">
          <p className="create-group-top-organizer">BECOME AN ORGANIZER</p>
          <h2 className="create-group-top-header create-group-underline">We'll walk you through a few steps to build your local community</h2>



          <h2 className="create-group-h2">First, set your group's location </h2>
          <p>Joinup groups meet locally, in person and online. We'll connect you with people
            in your area, and more can join you online.</p>

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
            <div className="create-group-underline"></div>

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

            <div className="create-group-underline"></div>

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
            <div className="create-group-underline"></div>

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
            <div className="create-group-underline"></div>

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
            <div className="create-group-underline"></div>

          </div>


          <p>Please add an image for your group below </p>
          <div className="create-group-form-row">
            <label htmlFor="image"></label>
            <input
              className="create-group-label-input"
              placeholder="Image Url"
              id="image"
              type="text"
              onChange={(e) => setImage(e.target.value)}
              value={image}
            />

            {errors.image && <p className="error">{errors.image}</p>}
            <div className="create-group-underline"></div>

          </div>

          <button type='submit' className="group-details-button">
            Create Group
          </button>
        </div>
      </form>
    </>
  )
}
