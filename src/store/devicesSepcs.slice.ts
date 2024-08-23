import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type CompData = {
    comp_id: number,
    comp_name: string,
    amount_need: number | undefined
}

export type DevicesSpecs = {
    device_id: number,
    device_name: string,
    comp_data: CompData[]
}

type SpecsID = number

export type DevicesSpecsState = {
    entites: Record<SpecsID, DevicesSpecs>,
    ids: SpecsID[]
    selectedDevice: DevicesSpecs | undefined
}

export const initialDevicesSpecsState: DevicesSpecsState = {
    entites: {},
    ids: [],
    selectedDevice: undefined
}


export const devicesSpecsSlice = createSlice({
    name: "devicesSpecs",
    initialState: initialDevicesSpecsState,
    selectors: {
        selectDevicesSpecs: state => state.entites,
        selectSelectedDevice: state => state.selectedDevice
    },
    reducers: {
        storeDevicesSpecs: (state, action: PayloadAction<{specsList: DevicesSpecs[]}>) => {
            const {specsList} = action.payload

            return {
                ...state,
                entites: specsList.reduce((acc, specs) => {
                    acc[specs.device_id] = specs
                    return acc
                }, {} as Record<SpecsID, DevicesSpecs>),
                ids: specsList.map(specs => specs.device_id)
            }
        },
        selectDevice: (state, action: PayloadAction<{device: DevicesSpecs}>) => {
            const {device} = action.payload
            return {
                ...state,
                selectedDevice: device
            } 
        },
        removeComponent: (state, action: PayloadAction<{comp_id: number}>) => {
            const {comp_id} = action.payload
            state.selectedDevice!.comp_data = state.selectedDevice!.comp_data.filter(comp => comp.comp_id !== comp_id)
        },
        addComponnent: (state, action: PayloadAction<{component: CompData}>) => {
            const {component} = action.payload
            state.selectedDevice!.comp_data.push(component)
        },
        updateComponent: (state, action: PayloadAction<{component: CompData}>) => {
            const {component} = action.payload
            state.selectedDevice!.comp_data = state.selectedDevice!.comp_data.map(comp => comp.comp_id === component.comp_id ? component : comp)
        }
        
    }
})