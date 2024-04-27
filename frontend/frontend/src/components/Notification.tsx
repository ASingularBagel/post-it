import React from 'react'
import Notification from '../interfaces/Notification'
import ProfileIcon from './ProfileIcon'

import dayjs from 'dayjs'; 
import relativeTime from 'dayjs/plugin/relativeTime'

//Redux
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../redux/store';
import { setPostModalOpen } from '../redux/features/ui/uiSlice';

const Notification = ({Notification} : {Notification: Notification}) => {
    dayjs.extend(relativeTime)

const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  return (
    <div className='h-24 grid grid-flow-col border-b-2 border-neutral-500'
    onClick={() => {
        (document.getElementById(`expandpost-${Notification.postId}`) as HTMLDialogElement)
        .showModal(); 
        dispatch(setPostModalOpen(true));
        console.log(Notification.postId);
    }}>
        <div className='col-span-2 -mt-9'>
            <ProfileIcon imageUrl={Notification?.imageUrl} property={'h-10'}/>
        </div>
        <div className='col-span-4'>
            <h1>{Notification?.sender} reacted to your post !</h1>
            <div>{Notification?.type === 'like' ? (
                <div><p>Like</p></div>
            ) : (
                <div><p>Comment</p></div>
            )}
            </div>
            <div>
                <p>{dayjs(Notification?.createdAt as string).fromNow()}</p>
            </div>
        </div>
    </div>
  )
}

export default Notification