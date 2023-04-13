import { csrfFetch } from './csrf';

//Action Types -------------------------------------------

const GET_ALL_GROUPS = '/groups';
const GET_GROUP_DETAILS = '/groups/:groupId';
const CREATE_GROUP = '/groups/new';
const UPDATE_GROUP = '/groups/edit'
const DELETE_GROUP = '/groups/delete'


// Action Creators ----------------------------------------

const LoadGroups = (list) => {
  return {
    type: GET_ALL_GROUPS,
    list
  }
}

const GetGroupDetailsAction = (group) => {
  return {
    type: GET_GROUP_DETAILS,
    group
  }
}

const CreateGroup = (group) => {
  return {
    type: CREATE_GROUP,
    group
  }
}


const UpdateGroup = (group) => {
  return {
    type: UPDATE_GROUP,
    group
  }
}

const DeleteGroup = (groupId) => {
  return {
    type: DELETE_GROUP,
    groupId: groupId
  }
}

// Group THUNKS ----------------------------------------------------

export const getAllGroupsThunk = () => async (dispatch) => {
  const response = await csrfFetch("/api/groups");

  if (response.ok) {
    const groups = await response.json();
    dispatch(LoadGroups(groups));
  }
}

export const getGroupDetailsThunk = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`);

  if (response.ok) {
    const group = await response.json();
    dispatch(GetGroupDetailsAction(group));
    return group;
  }
}

export const createGroupThunk = (group) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups`, {
      method: "POST",
      headers: { 'Content-Type': 'Application/json' },
      body: JSON.stringify(group)
    });

    if (response.ok) {
      const data = await response.json();
      const singleObject = {
        ...data,
        GroupImages: [],
        Organizer: {
          organizerId: data.organizerId
        },
        Venues: null
      };
      dispatch(CreateGroup(singleObject));
      return data;
    } else {
      console.log("Error response:", response);
    }

  } catch (error) {
    // Handle fetch error
    console.log("Fetch error:", error);
  }
}


export const updateGroupThunk = (group, groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "PUT",
    headers: { 'Content-Type': 'Application/json' },
    body: JSON.stringify(group)
  });

  console.log("UPDATE GROUP THUNK RESPONSE", response)

  if (response.ok) {
    const data = await response.json()
    console.log("UPDATE GROUP THUNK DATA", data)

    dispatch(UpdateGroup(data))
    return data
  }
}

export const deleteGroupThunk = (groupId) => async (dispatch) => {

    console.log("DELETE GROUP THUNK GROUPID", groupId)


    const response = await csrfFetch(`/api/groups/${groupId}`, {
      method: "DELETE",
      headers: {'Content-Type': 'Application/json'},
      body: null
    });

    console.log("DELETE GROUP THUNK RESPONSE", response)

    console.log("DELETE GROUP THUNK GROUPID", groupId)


    if (response.ok) {
      const data = await response.json();
      console.log("DELETE GROUP THUNK DATA", data)


      dispatch(DeleteGroup(groupId));
      return data;
    }
}



// Group Reducer -------------------------------------------------------

const initialState = {
  allGroups: {},
  currentGroup: {},
  singleGroup: {
    GroupImages: [],
    Organizer: {},
    Venues: [],
  },
}

const groupReducer = (state = initialState, action) => {
  let newState = {}

  switch (action.type) {
    case GET_ALL_GROUPS:
      newState = { ...state, allGroups: {}, currentGroup: {} }

      action.list.Groups.forEach(group => {
        newState.allGroups[group.id] = group
      })

      return newState

    case GET_GROUP_DETAILS:
      newState = { ...state, currentGroup: {} }

      newState.currentGroup = { ...action.group }

      return newState

    case CREATE_GROUP:
      newState = { ...state };

      newState.singleGroup = { ...action.group };

      return newState;

    case UPDATE_GROUP:
      newState = { ...state };
      newState.singleGroup = { ...state.singleGroup };

      console.log("UPDATE GROUP REDUCER BEFORE", newState)

      newState.singleGroup.name = action.group.name;
      newState.singleGroup.location = action.group.location;
      newState.singleGroup.about = action.group.about;
      newState.singleGroup.type = action.group.type;
      newState.singleGroup.private = action.group.private;

      console.log("UPDATED GROUP REDUCER AFTER", newState)

      return newState;

    case DELETE_GROUP:
      newState = { ...state };
      newState.singleGroup = {};
      newState.allGroups = { ...state.allGroups };

      console.log("DELETE GROUP REDUCER STATE", newState)
      console.log("DELETE GROUP REDUCER GROUPID", action.groupId)

      delete newState.allGroups[action.groupId];

      return newState;


    default:
      return state
  }
}

export default groupReducer;
