import React from 'react'
import { Link } from 'react-router-dom';

type iconProps = {
    imageUrl : String;
    userHandle?: String; 
    iconSize?: String; 
    property?: String
}

const ProfileIcon: React.FC<iconProps> = ({imageUrl, userHandle, iconSize, property}) => {
  return (
  <div>
    {userHandle ?  
    (<Link to={`/user/${userHandle}`}>
        <div className={`absolute avatar w-${iconSize} h-${iconSize} ${property}`}>
            <img src={`${imageUrl}`} alt="profileImage" className='rounded' />
        </div>
    </Link>) : (
        <div className={`absolute avatar w-${iconSize} h-${iconSize} ${property}`}>
            <img src={`${imageUrl}`} alt="profileImage" className='rounded' />
        </div>
    )
    }
  </div>
  )
}

export default ProfileIcon