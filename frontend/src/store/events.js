import { csrfFetch } from './csrf';




//EVENT TYPES

const GET_GROUP_EVENTS = '/events/getGroupEvents'
const CREATE_EVENT = '/events/new'
const GET_ALL_EVENTS = '/events/getAllEvents'
const GET_EVENT_DETAILS = '/events/:eventId'
const DELETE_EVENT = '/events/delete'








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

const CreateEvent = (event) => {
  return {
    type: CREATE_EVENT,
    event
  }
}

const DeleteEvent = (eventId) => {
  return {
    ttpe:DELETE_EVENT,
    eventId: eventId
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


export const createEventThunk = (event, groupId) => async (dispatch) => {

  console.log("TESTING TO SEE IF WE GET IN THUNK", groupId)

  const response = await csrfFetch(`/api/groups/${groupId}/events`, {
    method: "POST",
    headers: { 'Content-Type': 'Application/json' },
    body: JSON.stringify(event)
  });

console.log("RESPONSE FOR CREATE EVENT THUNK", response)

  if (response.ok) {
    const data = await response.json();
    console.log("CREATE EVENT THUNK - DATA")

    const eventSingleObj = {
      ...data,

      Group: {
        groupId
      },

      Venue: {
        venueId: 1
      },

      EventImages: [],
      Members: [],
      Attendees: []
    }
    ``
    dispatch(CreateEvent(eventSingleObj));
    return data;
  }
}

export const deleteEventThunk = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`, {

      method: "DELETE",
      headers: {'Content-Type': 'Application/json'},
      body: null
  });


  if (response.ok) {
      const data = await response.json();
      console.log("WE ARE ON RESPONSE FOR DELETE EVENT")
      dispatch(DeleteEvent(eventId));
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

    case CREATE_EVENT: {
      newState = { ...state };
      newState.singleEvent = { ...action.event };
      return newState;
    }

    case DELETE_EVENT:
      newState = {...state, singleEvent:{} , allEvents:{...state.allEvents}};

      delete newState.allEvents[action.eventId];
      
      return newState;



    default:
      return state

  }
}


export default eventReducer
