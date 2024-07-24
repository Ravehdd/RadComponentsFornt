import { createSlice, PayloadAction } from "@reduxjs/toolkit"


export type IsAuthenticated = boolean

export type AuthorizationToken = string | undefined

const initialAuthenticationState = {
    isAuthenticated: false,
    authorizationToken: undefined as AuthorizationToken
}


export const authenticationSlice = createSlice({
    name: "authentication",
    initialState: initialAuthenticationState,
    selectors: {
        selectIsAuthenticated: state => state.isAuthenticated,
        selectAuthorizationToken: state => state.authorizationToken
    },
    reducers: {
        setIsAuthenticated: (state, action: PayloadAction<{isAuthenticated: IsAuthenticated}>) => {
            state.isAuthenticated = action.payload.isAuthenticated
        },
        setAuthorizationToken: (state, action: PayloadAction<{authorizationToken: AuthorizationToken}>) => {
            state.authorizationToken = action.payload.authorizationToken
        }
    }
})




