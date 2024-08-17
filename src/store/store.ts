import { configureStore, createSelector } from "@reduxjs/toolkit";
import { componentsSlice} from "./components.slice";
import { replaceSlice } from "./replace.slice";
import { useDispatch, useSelector } from "react-redux";
import { orderDataSlice } from "./orderdata.slice";
import { orderSlice } from "./orders.slice";
import { addDeviceSlice } from "./addDevice.slice";
import { updateComponentSlice } from "./updateComponent.slice";
import { addComponentSlice } from "./addComponent.slice";
import { authenticationSlice } from "./authentication.slice";
import { devicesSpecsSlice } from "./devicesSepcs.slice";

export const store = configureStore({
    reducer: {
        [componentsSlice.name]: componentsSlice.reducer,
        [replaceSlice.name]: replaceSlice.reducer,
        [orderDataSlice.name]: orderDataSlice.reducer,
        [orderSlice.name]: orderSlice.reducer,
        [addDeviceSlice.name]: addDeviceSlice.reducer,
        [updateComponentSlice.name]: updateComponentSlice.reducer,
        [addComponentSlice.name]: addComponentSlice.reducer,
        [authenticationSlice.name]: authenticationSlice.reducer,
        [devicesSpecsSlice.name]: devicesSpecsSlice.reducer


    }
  });

export type AppDispatch = typeof store.dispatch;

export type AppState = ReturnType<typeof store.getState>;
export const createAppSelector = createSelector.withTypes<AppState>();
export const useAppSelector = useSelector.withTypes<AppState>();
export const useAppdispatch = useDispatch.withTypes<AppDispatch>();
// export const useAppStore = useStore.withTypes<typeof store>();