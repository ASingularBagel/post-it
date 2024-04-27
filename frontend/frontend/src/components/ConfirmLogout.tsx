import React from 'react'
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/features/user/userSlice';
import { useNavigate } from 'react-router-dom';

const ConfirmLogout = ({onClick} : {onClick?: () => void}) => {
    const dispatch = useDispatch();
    const v = useNavigate()

    const handleLogout = () => {
        dispatch(logoutUser());
        v('/'); 
      };
  return (
    <div className='w-full'>
        <p className='w-full' onClick={onClick}>Logout</p>
        <dialog id="logoutUser" className="modal">
        <div className="modal-box border border-white">
            <h3>Confirm log out ?</h3>
            <div className="modal-action">
            <form method="dialog" className='flex flex-row gap-4 items-center justify-center'>
                <button className="btn" onClick={handleLogout}>Confirm</button>
                <button className="btn" >Cancel</button>
            </form>
            </div>
        </div>
        </dialog>
    </div>
  )
}

export default ConfirmLogout