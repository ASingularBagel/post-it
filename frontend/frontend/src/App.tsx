/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import axios from './axiosConfig';

// Decoder
import { jwtDecode } from 'jwt-decode'

// Pages
import home from './pages/home'
import Login from './pages/login'
import Signup from './pages/signup'
import User from './pages/user.tsx'
import NotFound from './components/NotFound.tsx';

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Routes
import PublicRoute from './routes/PublicRoute'
import PrivateRoute from './routes/PrivateRoute'

// Redux
import { useDispatch } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { fetchUserInfo, logoutUser, setAuthenticationStatus } from './redux/features/user/userSlice'




function App() {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  let token;

  useEffect(() => {
    const fetchData = async () => {
      token = localStorage.getItem("FBIdToken");

      if ( token ) {
        const decodedToken = jwtDecode(token)
        
        if (decodedToken.exp! * 1000 < Date.now() ) {
          dispatch( logoutUser() );
        } else {
          dispatch( setAuthenticationStatus(true) );
          axios.defaults.headers.common['Authorization'] = token;
          await dispatch( fetchUserInfo() )
        }
      }
    };

    fetchData();
  }, [dispatch])
  
  return (
    <>
    <div id='body' className='w-full min-w-max text-white font-mono flex flex-col min-h-screen overflow-hidden'>
      <BrowserRouter>
        <div className='overflow-hidden'>
          <Navbar />
        </div>
        <div className='container mt-24 h-full w-full mx-auto xl:px-44 lg:px-28 md:px-16 xs:px-8 flex-grow overflow-auto'>
          <Routes>
            <Route path='/' Component={home}/>
            <Route path='/login' element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }/>
            <Route path='/signup' element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }/>
            <Route path='/user/:handle' element={
              <User />
            }/>
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
        <div className='overflow-hidden absolute bottom-0 w-screen'>
          <Footer />
        </div>
      </BrowserRouter>
    </div>
    </>
  );
}

export default App
