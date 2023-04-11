import { csrfFetch } from './csrf';


//Action Types -------------------------------------------


const GET_ALL_GROUPS = '/groups'

const GET_GROUP_DETAILS = '/groups/:groupId'






// Action Creators ----------------------------------------

const LoadGroups = (list) => {
  return {
    type: GET_ALL_GROUPS,
    list
  }
}


const GetGroupDetailsAction = (groupId) => {
  return {
    type: GET_GROUP_DETAILS,
    groupId
  }
}


// Group THUNKS ----------------------------------------------------

export const getAllGroupsThunk = () => async (dispatch) => {
  const response = await csrfFetch("/api/groups");

  if (response.ok) {
    const groups = await response.json()
    //console.log('GROUP THUNK', groups)

    //console.log("GET ALL GROUPS", LoadGroups(groups))
    dispatch(LoadGroups(groups))
  }
}


export const getGroupDetails = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`)

  if (response.ok) {
    const group = await response.json()
    console.log("GROUP DETAILS THUNK", group)
    dispatch(GetGroupDetailsAction(group))

  } else {
    console.log("error")
  }
}


//Group Reducer -------------------------------------------------------

const initialState = { allGroups: {}, currentGroup: {} }


const groupReducer = (state = initialState, action) => {
  let newState = {}

  switch (action.type) {
    case GET_ALL_GROUPS:
      newState = { ...state, allGroups: {}, currentGroup: {} }
      //console.log("ACTIONS", action.list.Groups)
      // console.log("STATE", state)
      // console.log("newState", newState.allGroups)

      action.list.Groups.forEach(group => {
        //console.log(newState)
        //console.log(group)
        newState.allGroups[group.id] = group
      })
      //console.log("NEW STATE", newState)
      return newState

    case GET_GROUP_DETAILS:
      newState = { ...state, allGroups: {}, currentGroup: {} }
      console.log(state)
      console.log("currentGroup", action.groupId.currentGroup)

    default:
      return state
  }
}


export default groupReducer
