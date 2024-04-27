import React from 'react'
import { IoCheckmarkDoneOutline } from 'react-icons/io5';
import { ThunkDispatch } from 'redux-thunk';

// Redux
import { setNotificationsRead } from '../redux/features/user/userSlice'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import User from '../interfaces/User';
import Notification from '../interfaces/Notification';

const MarkAllRead = () => {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const isLoading = useSelector((state: RootState) => state.user.loading);
    const notifications  : Notification[] = useSelector((state: RootState) => (state.user.userInfo as User).notifications); 
    const notificationIds : String[] = notifications.filter(notification => notification.read === false).map(notification => notification.notificationId)
    const handleMarkAllRead = () => {
        dispatch(setNotificationsRead(notificationIds))
    }
  return (
    <>
    {isLoading ? (
        <div>
            <span className="loading loading-spinner text-white"></span>
        </div>
    ): (
        <div className='w-full absolute flex flex-row cursor-pointer h-10'
        onClick={handleMarkAllRead}>
        <div className='w-full pr-4'>
            <button className='btn btn-primary w-full'>Mark all as read</button> 
        </div>
    </div>
    )}
    </>
  )
}

export default MarkAllRead