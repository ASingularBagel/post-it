import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

// Components
import FullProfile from '../components/FullProfile';
import NotFound from '../components/NotFound';


// Interfaces
import User from '../interfaces/User';


// Redux
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from '../redux/store'; 
import { getUserData } from '../redux/features/data/dataSlice';


const user = () => {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

    const { handle } = useParams<{ handle: string }>();
    const [userData, setUserData] = useState<User>()

    const posts = useSelector((state : RootState) => (state.data.posts));

    const dataError = useSelector((state: RootState) => state.data.error);
    useEffect(() => {
      document.title = `Get Posted | ${handle}`;
    })

  useEffect(() => {
    dispatch(getUserData({ userHandle: handle as string}))
    .then((res) => {
        setUserData(res.payload as User)
    })
    .catch(error => {
        console.log(error)
     })
  }, [handle]);
  return (
    <>
    { dataError && dataError.error === 'User not found.' && <NotFound /> }
    { userData && 
    <div className='overflow-hidden border-x-2 h-max'>
        <FullProfile user={userData} posts={posts} />
    </div>
    }
    </>
  )
}

export default user