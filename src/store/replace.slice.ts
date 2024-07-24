import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ComponentId = number;

export type Replace = {
    id: ComponentId
    comp_name: string
    in_stock: number
}

export type ReplaceObject = {
    replaceComponent: string | undefined
    forReplaceComponent: string | undefined
}

export type ReplaceState = {
    entities: Record<ComponentId, Replace>
    ids: ComponentId[]
    isNotEnough: boolean
    replaceComponent: string | undefined
    forReplaceComponent: string | undefined
    replaceList: ReplaceObject[]
}
const initialReplaceState: ReplaceState = {
    entities: {},
    ids: [],
    isNotEnough: false,
    replaceComponent: undefined,
    forReplaceComponent: undefined,
    replaceList: []
}
export const replaceSlice = createSlice({
    name: "replace",
    initialState: initialReplaceState,
    selectors: {
        selectAllReplaces: state => state.entities,
        selectNotEnough: state => state.isNotEnough,
        selectReplaceComponent: state => state.replaceComponent,
        selectForReplaceComponent: state => state.forReplaceComponent,
        selectReplaceList: state => state.replaceList

    },
    reducers: {
        stored: (state, action: PayloadAction<{replaces: Replace[]}>) => {
            const {replaces} = action.payload
            console.log("replaces", replaces)
            return {
                ...state,
                entities: replaces.reduce((acc, replace) => {
                    acc[replace.id] = replace
                    return acc
                }, {} as Record<ComponentId, Replace>),
                ids: replaces.map(replace => replace.id)
            }
        },
        removeReplace: (state) => {
            state.entities = {}
            state.ids = []
        },
        setNotEnough: (state, action: PayloadAction<{isNotEnough: boolean}>) => {
            state.isNotEnough = action.payload.isNotEnough
        },
        setReplaceComponent: (state, action: PayloadAction<{replaceComponent: string | undefined}>) => {
            state.replaceComponent = action.payload.replaceComponent
        },
        setForReplaceComponent: (state, action: PayloadAction<{forReplaceComponent: string | undefined}>) => {
            state.forReplaceComponent = action.payload.forReplaceComponent
        },
        setReplaceList: (state, action: PayloadAction<{replaceObject: ReplaceObject}>) => {
            state.replaceList.push(action.payload.replaceObject)
        },
        removeReplaceList: (state) => {
            state.replaceList = []
        }
    }
})