import {
  DASHBOARD_SET_USERNAME,
  STORE_ACTIVE_USERS,
  STORE_ACTIVE_ROOMS,
} from "../actions/dashboard";

const initialState = {
  username: null,
  activeUsers: [],
  activeRooms: [],
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case DASHBOARD_SET_USERNAME:
      return {
        ...state,
        username: action.username,
      };

    case STORE_ACTIVE_USERS:
      return {
        ...state,
        activeUsers: action.users,
      };

    case STORE_ACTIVE_ROOMS:
      return {
        ...state,
        activeRooms: action.rooms,
      };

    default:
      return state;
  }
};

export default dashboardReducer;
