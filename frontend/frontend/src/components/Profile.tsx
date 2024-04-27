import React, { ReactNode, useEffect, useState } from 'react'

// Utils
import dayjs from 'dayjs';

// Components
import ProfileLoading from './ProfileLoading';
import EditDetails from './EditDetails';
import { MdEdit } from "react-icons/md";

// Redux 
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from '../redux/store'; 
import ProfileIcon from './ProfileIcon';
import { Link } from 'react-router-dom';
import { uploadUserProfileImage } from '../redux/features/user/userSlice';
import Like from '../interfaces/Like'

type ProfileProps = {
    user: {
      credentials : {
        createdAt?: String, 
        handle?: String, 
        userId?: String,
        email?: String, 
        website?: String, 
        bio?: String, 
        imageUrl?: String, 
        loading?: String
      }
      likes : Like[], 
      notifications : []
    }
}

const Profile: React.FC<ProfileProps> = ({user}) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const isLoading = useSelector((state : RootState) => (state.user.loading));
  const isAuthenticated = useSelector((state: RootState) => (state.user.isAuthenticated));

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImgageInputClick = (event) => {
    const inputField = document.getElementById("imageInput"); 
    inputField?.click();
  }

  const handleImageChange = (event) => {
    if (event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
    const confirmField = document.getElementById('imageChangeConfirm'); 
    confirmField?.classList.toggle('hidden');
    console.log(selectedImage?.type)
  };

  const handleImageSubmit = () => {
    if (selectedImage) {
      dispatch(uploadUserProfileImage(selectedImage)).unwrap()
      .then(() => {
        const confirmField = document.getElementById('imageChangeConfirm'); 
        confirmField?.classList.add('hidden');
      })
      .catch(error => {
        setErrors(error);
        console.log(error);
      })
    }
  };

  const [errors, setErrors] = useState<{error: String}>({error: ''});

  let profileMarkup;

  profileMarkup = !isLoading ? ( isAuthenticated ? (
    <div className="flex flex-col gap-4 w-full p-3">
      <div className="flex gap-4 items-center">
        <div className="w-28 h-28 rounded shrink-0 relative">
        <span className='absolute rounded-full bg-neutral-950 
        text-white cursor-pointer h-8 w-8 
        -bottom-2 -right-2 z-10 border border-white
        text-center justify-center items-center flex
        ' onClick={(handleImgageInputClick)}><p className='text-xl'><MdEdit /></p></span>
        
          <ProfileIcon 
          imageUrl={user.credentials.imageUrl!} 
          userHandle={user.credentials.handle!} 
          iconSize={'28'}/>
        </div>
        <div className="flex flex-col gap-4">
          <div className=" h-4 w-20">
            <Link to={`/user/${user.credentials.handle}`}>
              <p className='transition-colors duration-200 hover:animate-gradient-x bg-clip-text hover:text-transparent bg-gradient-to-r from-violet-500 via-cyan-500 to-violet-500'>
                  {user.credentials.handle}
              </p>
              </Link>
            </div>
          <div className="h-4 w-28">Joined since {dayjs(String(user.credentials.createdAt)).format('MMM YYYY')}</div>
        </div>
      </div>
      <div className="h-44 w-full">{user.credentials.bio ? user.credentials.bio : "You don't have a bio yet !"}</div>
      <div className=''>
        <input type="file" id='imageInput' onChange={handleImageChange} className="file-input w-full max-w-xs hidden" />
        <div className='hidden' id='imageChangeConfirm'>
          <p>Change your profile picture</p>
          <button className={`btn btn-md ${isLoading ? 'btn-disabled' : ''}`} onClick={handleImageSubmit}>
            {isLoading ? (<span className="loading loading-spinner text-white"></span>) : (<p>Send it!</p>)}
          </button>
        </div>
        {errors ? (<p className='text-red-500 mt-2'>{errors.error}</p>) : null}
      </div>
    </div>
  ) : (
    <div className='text-center mt-10 flex flex-col gap-3'><h1>You're not logged in! Log in to see your details.</h1><Link to={'/login'}><button className='btn btn-ghost btn-lg my-3'>Login</button></Link></div>
  ) ) : (
  <ProfileLoading />
  );

  setTimeout(() => {
    setErrors({ error: '' });
  }, 5000);

  return (
    <div>{profileMarkup}</div>
  )
}

export default Profile