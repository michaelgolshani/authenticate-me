import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteGroupThunk } from "../../store/groups";
import { useHistory, useParams } from "react-router-dom";

function DeleteGroupModal({ groupId }) {
  const dispatch = useDispatch();
  const history = useHistory()
  const { closeModal } = useModal();


  const HandleDeleteSubmit = (groupId) => {
    dispatch(deleteGroupThunk(groupId))
    history.push('/groups/')
    closeModal()
  };


  const HandleDeleteNoSubmit = async (e) => {
    closeModal()
  }

  return (
    <div className="delete-group-container">
      <h1 className="delete-group-title">Confirm Delete</h1>
      <p className="delete-group-question">Are you sure you want to remove this group?</p>
      <button type="submit" className="delete-group-yes-button" onClick={() => HandleDeleteSubmit(groupId)}>
        Yes (Delete Group)
      </button>
      <button type="submit" className="delete-group-no-button" onClick={HandleDeleteNoSubmit}>
        No (Keep Group)
      </button>
    </div>
  )
}


export default DeleteGroupModal
