import { csrfFetch } from './csrf';


//Action Types


const LOAD_GROUPS = '/groups'




// Action Creators


const LoadGroups = (list) => {
  return {
    type: LOAD_GROUPS,
    list
  }
}



// Group THUNKS

export const getAllGroupsThunk = () => async(dispatch) => {
  const response = await csrfFetch("/api/groups");

  if (response.ok) {
    const groups = await response.json()
    console.log('GROUP THUNK', groups)

    dispatch(LoadGroups(groups))
  }
}





//NORMALIZE DATA



// function normalizeIdArrToObj(array) {

//   const allGroups = {};
//   array.map((group) => allGroups[group.id] = group)

//   console.log('ALL GROUPS', allGroups)
//   return allGroups;
// };



const initialState = {allGroups: {}, currentGroup:{}}


const groupReducer = (state=initialState, action) => {
  let newState={}

  switch(action.type) {
    case LOAD_GROUPS:
      newState = {...state,allGroups:{}, currentGroup:{}}
      console.log("ACTIONS", action.list.Groups)
    // console.log("STATE", state)
    // console.log("newState", newState.allGroups)

    action.list.Groups.forEach(group => {
      console.log(newState)
      console.log(group)
      newState.allGroups[group.id] = group
    })
      return newState

    default:
      return state
  }
}


export default groupReducer
