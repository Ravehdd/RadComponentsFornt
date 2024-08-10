import { createSlice, PayloadAction } from "@reduxjs/toolkit"


export type DeviceName = string 

export type Component = {
    comp_name: string
    amount_need: number
}

export type ComponentsState = {
    device_name: DeviceName | undefined
    components: Component[]
}

const initialDeviceState: ComponentsState = {
    device_name: undefined,
    components: []
}

export const addDeviceSlice = createSlice({
    name: "addDevice",
    initialState: initialDeviceState,
    selectors: {
        selectDevice: state => state.device_name,
        selectComponents: state => state.components
    },
    reducers: {
        setDevice(state, action: PayloadAction<{device_name:DeviceName}>) {
            state.device_name = action.payload.device_name
        },

        setComponent(state, action: PayloadAction<{component: Component}>) {
            state.components.push(action.payload.component)
        },
        removeComponent(state, action: PayloadAction<{comp_name: string}>) {
            state.components = state.components.filter(component => component.comp_name !== action.payload.comp_name)
        }

        
}
})

