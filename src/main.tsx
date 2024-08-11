import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { store } from "./store/store.ts"
import { Provider } from 'react-redux'
import { BrowserRouter } from "react-router-dom";
import { ModalState } from './context/ModalContext.tsx'

// export const apiBaseUrl = "http://radcomponents.ru:8000/api/v1/";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ModalState>
          <App /> 
        </ModalState>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
