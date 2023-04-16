import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteEventThunk } from "../../store/events";
import { useHistory, useParams } from "react-router-dom";


function DeleteEventModal({ eventId }) {
  const dispatch = useDispatch();
  const history = useHistory()
  const { closeModal } = useModal();


  const HandleDeleteSubmit = (eventId) => {
    dispatch(deleteEventThunk(eventId))
    history.push('/events/')
    closeModal()
  };


  const HandleDeleteNoSubmit = async (e) => {
    closeModal()
  }

  return (
    <div className="delete-group-container">
      <h1 className="delete-group-title">Confirm Delete</h1>
      <p className="delete-group-question">Are you sure you want to remove this event?</p>
      <button type="submit" className="delete-group-yes-button" onClick={() => HandleDeleteSubmit(eventId)}>
        Yes (Delete Event)
      </button>
      <button type="submit" className="delete-group-no-button" onClick={HandleDeleteNoSubmit}>
        No (Keep Event)
      </button>
    </div>
  )
}


export default DeleteEventModal
