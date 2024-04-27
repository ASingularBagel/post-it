import Like from './Like'

interface User {
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

export default User;