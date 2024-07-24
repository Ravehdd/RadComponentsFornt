import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type OrderData = {
    id: number
    comp_name: string
    in_stock: number
    amount_need: number
}

type OrderDataId = number

export type OrderDataState = {
    entities: Record<OrderDataId, OrderData>
    ids: OrderDataId[]
}

export const initialOrderDataState: OrderDataState = {
    entities: {},
    ids: []
}


export const orderDataSlice = createSlice({
    name: "orderdata",
    initialState: initialOrderDataState,
    selectors: {
        selectOrderData: state => state.entities,
    },
    reducers: {
        addOrderData: (state, action: PayloadAction<{orderdata: OrderData[]}>) => {
            const {orderdata} = action.payload

            return {
                ...state,
                entities: orderdata.reduce((acc, orderdata) => {
                    acc[orderdata.id] = orderdata
                    return acc
                }, {} as Record<OrderDataId, OrderData>),
                ids: orderdata.map(orderdata => orderdata.id)
            }   
        },
        removeOrderData: (state) => {
            return {
                ...state,
                entities: {},
                ids: []
            }
        }
    }
})
