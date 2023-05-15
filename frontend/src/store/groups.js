import { csrfFetch } from "./csrf";

//Action Types -------------------------------------------

const GET_ALL_GROUPS = '/groups';
const GET_GROUP_DETAILS = '/groups/:groupId';
const CREATE_GROUP = '/groups/new';
const UPDATE_GROUP = '/groups/edit'
const DELETE_GROUP = '/groups/delete'
const ADD_GROUP_IMAGE = '/groups/image'
const UPDATE_GROUP_IMAGE = '/groups/image/edit'
const ADD_MEMBER = 'groups/:groupId/newMembership'
const GET_ALL_MEMBERS = 'groups/:groupId/members'



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

const AddGroupImage = (image) => {
  return {
    type: ADD_GROUP_IMAGE,
    image
  }
}

const UpdateGroupImage = (image) => {
  return {
    type: UPDATE_GROUP_IMAGE,
    image
  }
}

const AddMember = (member) => {
  return {
    type: ADD_MEMBER,
    member
  }
}

const GetMembers = (members) => {
  return {
    type: GET_ALL_MEMBERS,
    members
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
  const response = await fetch(`/api/groups/${groupId}`);

  if (response.ok) {
    const group = await response.json();

    console.log("GET GROUP DETAILS THUNK GROUP DATA", group)
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
    headers: { 'Content-Type': 'Application/json' },
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


export const addGroupImageThunk = (groupId, image) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/images`, {
    method: "POST",
    headers: { "Content-Type": "Application/json" },
    body: JSON.stringify(image)
  })

  if (response.ok) {
    const data = await response.json()
    dispatch(AddGroupImage(image, groupId))
    return data
  }
}


export const updateGroupImageThunk = (imageId, image) => async (dispatch) => {
  const response = csrfFetch(`/api/group-images/${imageId}`, {
    method: "PUT",
    headers: { "Content-Type": "Application/json" },
    body: JSON.stringify(image)
  })

  if (response.ok) {
    const data = await response.json()
    dispatch(UpdateGroupImage(data))
    return data
  }
}


export const addMemberToGroupThunk = (groupId, user) => async (dispatch) => {
  const response = csrfFetch(`/api/groups/${groupId}/membership`, {
    method: "POST",
    headers: { "Content-Type": "Application/json" },
    body: null
  })

  if (response.ok) {
    const newMember = await response.json()
    console.log("ADD MEMBERSHIP GROUP THUNK DATA", newMember)

    // const memberObj = {

    // }
    // console.log("MEMBER DATA IN  THUNK AFTER RESPONSE", newMember)

    dispatch(AddMember(newMember))
    return newMember
  }
}

export const getAllMembersThunk = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/members`);

  if (response.ok) {
    const members = await response.json();
    console.log("WE ARE IN GET MEMBERS THUNK. HERE IS MEMBERS", members)
    dispatch(GetMembers(members));
  }
}


// Group Reducer -------------------------------------------------------

const initialState = {
  allGroups: {},
  currentGroup: {

    GroupImages: [],
    Organizer: {

    },
    Venues: [],
    Members: []  // added this last minute
  },
  singleGroup: {
    GroupImages: [],
    Organizer: {},
    Venues: [],
  },
  allEvents: {},

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
      newState = { ...state }

      newState.currentGroup = { ...action.group, Members: [] }

      console.log("CHECKING GROUP DETAILS FOR EVENT DETAILS", newState.currentGroup)

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

    case ADD_GROUP_IMAGE:
      newState = { ...state }
      console.log("GROUP IMAGE REDUCER", state.singleGroup.GroupImages)
      newState.singleGroup.GroupImages = [action.image, ...state.singleGroup.GroupImages]
      return newState;

    case UPDATE_GROUP_IMAGE:
      newState = { ...state }
      newState.singleGroup.GroupImages = [...state.singleGroup.GroupImages]
      console.log("NEW STATE GROUP IMAGES ARRAY", newState.singleGroup.GroupImages)
      newState.singleGroup.GroupImages.forEach(image => {
        if (image.id === action.image.id) {
          image.url = action.image.url
        }
      })
      return newState

    case ADD_MEMBER:

      newState = { ...state }
      newState.currentGroup.Members = [action.member, ...state.currentGroup.Members]
      return newState;

    case GET_ALL_MEMBERS:
      newState = { ...state }
      newState.currentGroup.Members = [...state.currentGroup.Members]
      return newState

    default:
      return state
  }
}

export default groupReducer;
