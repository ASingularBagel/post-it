import React from 'react'

const ProfileLoading = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
    <div className="flex gap-4 items-center">
      <div className="skeleton w-28 h-28 rounded shrink-0"></div>
      <div className="flex flex-col gap-4">
        <div className="skeleton h-4 w-20"></div>
        <div className="skeleton h-4 w-28"></div>
      </div>
    </div>
    <div className="skeleton h-44 w-full"></div>
  </div>
  )
}

export default ProfileLoading