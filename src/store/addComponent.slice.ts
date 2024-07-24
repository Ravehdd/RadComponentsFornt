import { createSlice, PayloadAction } from "@reduxjs/toolkit"



export type Component = {
    comp_name: string
    amount_add: number
    category: string
}

export type ComponentsState = {
    components: Component[]
}

const initialDeviceState: ComponentsState = {
    components: []
}

export const addComponentSlice = createSlice({
    name: "addComponent",
    initialState: initialDeviceState,
    selectors: {
        selectComponents: state => state.components
    },
    reducers: {
        setComponent(state, action: PayloadAction<{component: Component}>) {
            state.components.push(action.payload.component)
        }
        
}
})



