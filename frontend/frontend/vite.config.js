import { defineConfig } from 'vite'
import dotenv from 'dotenv'

dotenv.config() 

export default defineConfig({
  define: {
    __BASEURL__: `"${process.env.VITE_BASE_URL}"` 
  },
})