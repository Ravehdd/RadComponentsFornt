import { createSlice, PayloadAction } from "@reduxjs/toolkit"



export type Component = string | undefined


const initialState = {
    component: undefined as Component
}


export const updateComponentSlice = createSlice({
    name: "updateComponent",
    initialState,
    selectors: {
        selectComponent: state => state.component  
    },
    reducers: {
        setComponent(state, action: PayloadAction<{component: Component}>) {
            state.component = action.payload.component
        }
    }
})