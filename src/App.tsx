import { Route, Routes } from 'react-router-dom';
import './App.css'
import Header from "./components/Header/Header"
import MainTablePage from './pages/MainTablePage';
import AddOrderPage from './pages/AddOrderPage';
import OrdersPage from './pages/OrdersPage';
import AddDevicePage from './pages/AddDevicePage';
import AddComponentPage from './pages/AddComponentPage';
import { useEffect } from 'react';
import AuthorizationPage from './pages/AuthorizationPage';
import { useNavigate } from 'react-router-dom';
// import { authenticationSlice } from './store/authentication.slice';

export const apiBaseUrl = "http://localhost:8000/api/v1/";
export const authUrl = "http://localhost:8000/auth/token/";

function App() {
  // const dispatch = useDispatch()
  const storedAuthToken = localStorage.getItem('authToken');
  const storedIsAuthenticated = localStorage.getItem('isAuthenticated')
  console.log("App.jsx", storedAuthToken, storedIsAuthenticated)
  // if (storedAuthToken && storedIsAuthenticated) {
  //     dispatch(authenticationSlice.actions.setAuthorizationToken({authorizationToken: storedAuthToken}));
  //     dispatch(authenticationSlice.actions.setIsAuthenticated({isAuthenticated: true}));
  // }
  // const isAuthenticated = useAppSelector(authenticationSlice.selectors.selectIsAuthenticated)


  
  useEffect(() => {
    if(storedIsAuthenticated === "false") {
      navigate('/auth')
    } else {
      navigate('/')
    }
  }, [storedIsAuthenticated])
  
  const navigate = useNavigate()

  return (
    <>
      <>
        <Header />
        <Routes>
          <Route path="/" element={<MainTablePage />} />
          <Route path="/addorder" element={<AddOrderPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/adddevice" element={<AddDevicePage />} />
          <Route path="/addcomponent" element={<AddComponentPage />} />
          <Route path="/auth" element={<AuthorizationPage />} />
        </Routes>
      </>

    </>
  )
}

export default App
