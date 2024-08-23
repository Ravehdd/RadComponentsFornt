import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Component = {
    comp_id: number;
    comp_name: string
    amount: number
    category_name: string
}

export type Consumables = {
    comp_id: number
    comp_name: string
}

export type ConsumablesId = number;
export type ComponentId = number;

export type ComponentsSate = {
    entities: Record<ComponentId, Component>
    ids: ComponentId[]
    selectedCategory: string | undefined
}

export type ConsumablesState = {
    entities: Record<ConsumablesId, Consumables>,
}

const initialComponentsState: ComponentsSate = {
    entities: {},
    ids: [],
    selectedCategory: undefined
}

const initialConsumablesState: ConsumablesState = {
    entities: {}
}

// const initialState = {
//     components: initialComponentsState,
//     consumables: initialConsumablesState
// }


export const componentsSlice = createSlice({
    name: "components",
    initialState: initialComponentsState,
    selectors: {
        selectAllComponents: state => state.entities,
        selectedCategory: state => state.selectedCategory,
        selectByCategory: createSelector(
            (state: ComponentsSate) => state.entities,
            (state: ComponentsSate) => state.selectedCategory,
            (entities, selectCategory) => selectCategory ? Object.values(entities).filter(component => component.category_name === selectCategory) : entities
        )        
    },
    reducers: {
        stored: (state, action: PayloadAction<{components: Component[]}>) => {
            const {components} = action.payload 
            return {
                ...state,
                entities: components.reduce((acc, component) => {
                    acc[component.comp_id] = component
                    return acc
                }, {} as Record<ComponentId, Component>),
                ids: components.map(component => component.comp_id)
            }
        },
        selectByCategory: (state, action: PayloadAction<{category: string | undefined}>) => {
            state.selectedCategory = action.payload.category
            }
    }
})

export const consumablesSlice = createSlice({
    name: "consumables",
    initialState: initialConsumablesState,
    selectors: {
        selectAllConsumables: state => state.entities
    },
    reducers: {
        stored: (state, action: PayloadAction<{consumables: Consumables[]}>) => {
            const {consumables} = action.payload
            return {
                ...state,
                entities: consumables.reduce((acc, consumable) => {
                    acc[consumable.comp_id] = consumable
                    return acc
                }, {} as Record<ConsumablesId, Consumables>),
            }
        }
    }
})
