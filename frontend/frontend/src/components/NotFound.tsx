import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='h-max flex flex-col gap-4 items-center justify-center'>
        <p className='text-center'>
            Nothing here but us chickens ! (bad request)
        </p>
        <Link to={'/'}>
        <button className='btn btn-primary' role='button'>Return to home page</button>
        </Link>
    </div>
  )
}

export default NotFound