import { csrfFetch } from './csrf';

//Action Types -------------------------------------------

const GET_ALL_GROUPS = '/groups';
const GET_GROUP_DETAILS = '/groups/:groupId';
const CREATE_GROUP = '/groups/new';

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
      // Handle error response
      console.log("Error response:", response);
    }
  } catch (error) {
    // Handle fetch error
    console.log("Fetch error:", error);
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

    default:
      return state
  }
}

export default groupReducer;
