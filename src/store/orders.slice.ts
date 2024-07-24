import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type CompData = {
    comp_name: string
    amount_need: number
}

export type Order = {
    order_id: number
    device_name: string
    amount_devices: number
    creation_date: string
    comp_data: CompData[]

}

type OrderId = number

export type OrderState = {
    entities: Record<OrderId, Order>
    ids: OrderId[]
}

export const initialOrderState: OrderState = {
    entities: {},
    ids: []
}

export const orderSlice = createSlice({
    name: "order",
    initialState: initialOrderState,
    selectors: {
        selectOrders: state => state.entities
    },
    reducers: {
        storeOrders: (state, action: PayloadAction<{ordersList: Order[]}>) => {
            const {ordersList} = action.payload
            return {
                ...state,
                entities: ordersList.reduce((acc, order) => {
                    acc[order.order_id] = order
                    return acc
                }, {} as Record<OrderId, Order>),
                ids: ordersList.map(order => order.order_id)
            }
        },
        removeOrders: (state) => {
            state.entities = {}
            state.ids = []
        }

    }
})