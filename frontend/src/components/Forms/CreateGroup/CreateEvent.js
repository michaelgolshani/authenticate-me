import React, { useEffect, useState, useLayoutEffect, useMemo } from "react"
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createEventThunk, getEventDetailsThunk, addEventImageThunk } from "../../../store/events";
import './CreateGroup.css';

export default function CreateEvent({ sessionUser }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();



  const checkState = useSelector((state) => state)
  const group = useSelector((state) => state.group.currentGroup)

  let groupId = parseInt(group.id)
  // console.log("CURRENT EVENT STATE", currentGroup)
  console.log("CHECK STATE - EVENT FORM", checkState)
  console.log("GROUP ID CREATE EVENT PAGE", groupId)


  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [isPrivate, setisPrivate] = useState("");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [image, setImage] = useState("");
  const [about, setAbout] = useState("");
  const [errors, setErrors] = useState({});




  useEffect(() => {
    validate();
  }, [name, about, type, isPrivate, image, price, startDate, endDate]);

  useEffect(() => {
    setErrors({});
},[]);


  const validate = () => {
    const errors = {}

    if (!name) {
      errors.name = "Name is required";
    }

    if (!type) {
      errors.type = "Event Type is required";
    }

    if (!isPrivate) {
      errors.isPrivate = "Visibility is required";
    }

    if (!price) {
      errors.price = "Price is required";
    }

    if (!startDate) {
      errors.startDate = "Event start is required";
    }

    if (!endDate) {
      errors.endDate = "Event start is required";
    }

    if (image) {
      const fileExtension = image.split('.').pop().toLowerCase();
      const checkLast = ['jpg', 'png', 'jpeg'];
      if (!checkLast.includes(fileExtension)) {
        errors.image = "Image URL needs to end in .png, .jpg or .jpeg";
      }
    }

    console.log("ERRORS", errors)


    if (!about || about.length < 30) {
      errors.about = "Descrption must be at least 30 characters long";
    }

    return errors

  }



  const OnSubmit = async (e) => {
    //SAME as CREATE GROUP ESSENTIALLY
    e.preventDefault();
    const errors = validate();
    const errorContent = Object.values(errors);
    if (errorContent.length) return setErrors(errors);


    //We need to handle "Person" and "Online" choice. So we will convert the choice to a boolean of true or false
    const convertToBoolean = (input) => {
      if (input === "Private") {
        return true
      } else {
        return false
      }
    }

    //-------------------------------------------------------------------------------------------


    const eventInfo = {
      venueId: 5,
      name,
      type,
      private: convertToBoolean(isPrivate),
      price: Number(price),
      startDate,
      endDate,
      description: about,
      capacity: 20


    };

    const addImage = { url: image, preview: true }


    const createdEvent = await dispatch(createEventThunk(eventInfo, groupId));
    console.log("CREATED EVENT BEFORE IMAGE", createdEvent)
    await dispatch(addEventImageThunk(createdEvent.id,addImage))
    console.log("CREATED EVENT AFTER IMAGE", createdEvent)

    history.push(`/events/${createdEvent.id}`);
  }

  return (
    <>


      <form onSubmit={OnSubmit}>
        <div className="create-event-container">

          <h2 className="create-event-top-header create-event-underline">Create an event for {group.name} </h2>

          <p>What is the name of your event?</p>

          <div className="create-event-form-row">
            <label htmlFor="name"></label>
            <input
              className="create-event-label-input"
              placeholder="Event Name"
              id="name"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            {errors.name && <p className="error">{errors.name}</p>}
            <div className="create-event-underline"></div>

          </div>







          <div className="create-event-form-row">

            <p>Is this an in person or online event?</p>
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





            <p>What is the price for this event?</p>
            <label>
              <input
                placeholder="$ 0"
                id="price"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}></input>
            </label>
            {errors.price && <p className="error">{errors.price}</p>}
            <div className="create-event-underline"></div>

          </div>






          <div className="create-event-form-row">
            <p> When does your event start? </p>
            <label>
              <input
                id="startDate-event"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}>
              </input>
            </label>

            {errors.startDate && <p className="error">{errors.startDate}</p>}






            <p> When does your event end? </p>
            <label>
              <input
                id="endDate-event"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}>
              </input>
            </label>

            {errors.endDate && <p className="error">{errors.endDate}</p>}

            <div className="create-event-underline"></div>

          </div>






          <p>Please add an image for your group below </p>
          <div className="create-event-form-row">
            <label htmlFor="image"></label>
            <input
              className="create-event-label-input"
              placeholder="Image Url"
              id="image"
              type="text"
              onChange={(e) => setImage(e.target.value)}
              value={image}
            />

            {errors.image && <p className="error">{errors.image}</p>}
            <div className="create-event-underline"></div>

          </div>





          <div className="create-group-form-row">

            <p className="create-event-describe">Please describe your event</p>
            <label htmlFor="about"></label>
            <input
              className="create-event-label-about"
              placeholder="Please write at least 30 characters"
              id="about"
              type="text"
              onChange={(e) => setAbout(e.target.value)}
              value={about}
            />
            {errors.about && <p className="error">{errors.about}</p>}
            <div className="create-event-underline"></div>

          </div>






          <button type='submit'>
            Create Event
          </button>
        </div>
      </form>





    </>
  )


}
