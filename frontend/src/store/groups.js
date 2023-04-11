import { csrfFetch } from './csrf';


//Action Types


const LOAD_GROUPS = '/groups'




// Action Creators


const LoadGroups = (groups) => {
  return {
    type: LOAD_GROUPS,
    lists
  }
}



// Group THUNKS

export const getAllGroupsThunk = () => async(dispatch) => {
  const response = await csrfFetch("/groups");

  if (response.ok) {
    const groups = await response.json()
    console.log('GROUP THUNK', groups)

    dispatch(LoadGroups(groups))
  }
}





//NORMALIZE DATA

//(array to obj. uses id as the key for the obj)
// const state = {};
function normalizeIdArrToObj(array) {
  // console.log('list: ', array)
  const allGroups = {};
  array.map((group) => allGroups[group.id] = group)
  // console.log('allGroups: ', allGroups)
  return allGroups;
};
