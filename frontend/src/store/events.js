import { csrfFetch } from './csrf';




//EVENT TYPES

const GET_GROUP_EVENTS = '/events/getGroupEvents'
const CREATE_EVENT = '/events/new'
const GET_ALL_EVENTS = '/events/getAllEvents'
const GET_EVENT_DETAILS = '/events/:eventId'









// EVENT ACTIONS


const GetGroupEvents = (events) => {
  return {
    type: GET_GROUP_EVENTS,
    events
  }
}


const GetAllEvents = (events) => {
  return {
    type: GET_ALL_EVENTS,
    events
  }
}

const GetEventDetails = (event) => {
  return {
    type: GET_EVENT_DETAILS,
    event
  }
}



// EVENT THUNKS

export const getGroupEventsThunk = (groupId) => async (dispatch) => {
  const response = await fetch(`/api/groups/${groupId}/events`);
  if (response.ok) {
    const data = await response.json()
    dispatch(GetGroupEvents(data))
    return data
  }
}

export const getAllEventsThunk = () => async (dispatch) => {
  const response = await fetch(`/api/events/`)
  if (response.ok) {
    const data = await response.json()
    dispatch(GetAllEvents(data))
    return data
  }
}


export const getEventDetailsThunk = (id) => async (dispatch) => {
  const response = await fetch(`/api/events/${id}`);

  if (response.ok) {

    const data = await response.json();
    console.log("DATA FOR GET EVENT DETAILS THUNK", data)
    dispatch(GetEventDetails(data));
    return data;
  }
}


//Event Reducer



const initialState = {


  allEvents: {

  },

  singleEvent: {

    Group: {

    },

    Venue: {

    },
    EventImages: [],
    Members: [],
    Attendees: [],
  },


}



const eventReducer = (state = initialState, action) => {
  let newState = {}
  switch (action.type) {

    case GET_GROUP_EVENTS:
      newState = { ...state, allEvents: {} };

      console.log("GROUP ACTION EVENTS REDUCER", action.events)
      action.events.Events.forEach((event) => (newState.allEvents[event.id] = event))
      return newState;

    case GET_ALL_EVENTS:
      newState = { ...state, allEvents: {} }

      console.log("ACTION EVENTS", action.events.Events)

      action.events.Events.forEach((event) => (newState.allEvents[event.id] = event))

      return newState;

    case GET_EVENT_DETAILS:
      newState = { ...state };
      newState.singleEvent = { ...action.event };
      return newState;

    default:
      return state

  }
}


export default eventReducer
