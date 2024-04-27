import React, { useEffect, useState } from 'react'

// Redux 
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';

// Interface 
import User from '../interfaces/User';

import { editUserDetails } from '../redux/features/user/userSlice';
import { setEditUser } from '../redux/features/ui/uiSlice';
import { ThunkDispatch } from 'redux-thunk';

const EditDetails = ({onClick} : {onClick?: () => void}) => {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

    const [bio, setBio] = useState<string | number | readonly string[] | undefined>(''); 
    const [website, setwebsite] = useState<String>(''); 

    const [errors, setErrors] = useState<{error: String}>({error: ''})

    const userError = useSelector((state: RootState) => state.user.error);
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const isEditUserOpen = useSelector((state: RootState) => state.ui.isEditUserOpen);

    useEffect(() => {
        const fetchData = async () => {
            try{
                let credentials = (userInfo as User).credentials;
                setBio(credentials.bio as string ? credentials.bio as string : ''); 
                setwebsite(credentials.website ? credentials.website : ''); 
            } catch (error) {
                setErrors(error)
                console.log(error)
            }
        };
        fetchData();
    }, [isEditUserOpen]);

    const handleChange = (event) => {
        const { name, value } = event.target;
    
        setErrors({error : ''});
        
        switch(name) {
          case 'bio':
            setBio(value);
            break;
          case 'website':
            setwebsite(value);
            break;
          default:
            break;
        }
    }

    const handleSubmit = async () => {
        event?.preventDefault(); 
        if ( bio === '' || website === '') {
            setErrors({error : 'Please fill in at least one field or cancel operation.'})
            return;
        }

        const userData = {
            bio : bio as String, 
            website: website as String

        }

        try { 
            dispatch(editUserDetails(userData))
        } catch( error ) {
            console.log(error);
        }

    }

    const handleClose = () => {
        dispatch(setEditUser(false))
    }

  return (
    <div>
        <p className='w-full' onClick={onClick}>Edit user details</p>
        <dialog id="editUserDetails" className="modal">
        <div className="modal-box border border-white">
            <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">You're now editing your details.</p>
            <div className='py-4'>
                <p>Bio: {bio ? bio : "You don't have a bio yet."}</p>
                <p>Website: {website ? website : "You haven't set your website yet"}</p>
            </div>

            <div>
                {errors && <p className='text-red-500'>{errors.error}</p>}
            </div>
            <div className='py-4'>
                <p className='mb-2'>Change your bio: </p>
                <textarea className="textarea w-full border input-bordered" 
                name='bio' 
                id='bio' 
                placeholder="Bio" 
                defaultValue={bio}
                onChange={handleChange}
                ></textarea>
            </div>

            <div className='py-4'>
                <p className='mb-2'>Change your website address: </p>
                <input className="input input-bordered w-full"
                type="text" 
                name='website' 
                id='website' 
                placeholder="https://" 
                onChange={handleChange}
                />
            </div>

            <div className="modal-action">
            <form method="dialog" className='flex flex-row gap-4'>
                <button className="btn" onClick={handleSubmit}>Confirm</button>
                <button className="btn" onClick={handleClose}>Cancel</button>
            </form>
            </div>
        </div>
        </dialog>
    </div>
  )
}

export default EditDetails