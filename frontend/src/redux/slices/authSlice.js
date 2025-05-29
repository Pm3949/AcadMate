import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        authUser: null,
    },
    reducers: {
        loginUser: (state, action) => {
            state.authUser = action.payload;
        },
        logoutUser: (state) => {
            state.authUser = null;
        },
    },

})

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;