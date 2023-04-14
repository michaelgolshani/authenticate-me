import { csrfFetch } from './csrf';




//EVENT TYPES

const GET_GROUP_EVENTS = '/events/getGroupEvents'

const CREATE_EVENT ='/event/new'









// EVENT ACTIONS


const GetGroupEvents = (events) => {
  return {
    type: GET_GROUP_EVENTS,
    events
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

    default:
      return state

  }
}


export default eventReducer
