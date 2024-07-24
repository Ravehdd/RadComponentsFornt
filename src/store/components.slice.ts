import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Component = {
    comp_id: number;
    comp_name: string
    amount: number
    category_name: string
}

export type ComponentId = number;

export type ComponentsSate = {
    entities: Record<ComponentId, Component>
    ids: ComponentId[]
    selectedCategory: string | undefined
}

const initialComponentsState: ComponentsSate = {
    entities: {},
    ids: [],
    selectedCategory: undefined
}


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

