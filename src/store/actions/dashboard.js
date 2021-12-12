
export const DASHBOARD_SET_USERNAME = 'DASHBOARD_SET_USERNAME';
export const STORE_ACTIVE_USERS = 'STORE_ACTIVE_USERS';
export const STORE_ACTIVE_ROOMS = 'STORE_ACTIVE_ROOMS'

export const setDashboardUsername = (username) => ({
    type: DASHBOARD_SET_USERNAME,
    username
});


export const saveActiveUsers = (users) => (
    {
        type: STORE_ACTIVE_USERS ,
        users
    }
);

export const saveActiveRooms = (rooms) => ({
    type: STORE_ACTIVE_ROOMS,
    rooms
})

