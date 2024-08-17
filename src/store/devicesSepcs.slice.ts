import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type CompData = {
    comp_name: string,
    amount_need: number
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
}

export const initialDevicesSpecsState: DevicesSpecsState = {
    entites: {},
    ids: []
}


export const devicesSpecsSlice = createSlice({
    name: "devicesSpecs",
    initialState: initialDevicesSpecsState,
    selectors: {
        selectDevicesSpecs: state => state.entites
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
        }
    }
})