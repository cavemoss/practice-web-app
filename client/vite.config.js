import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
  plugins: [react()],
  base: "/",
  preview: {
    port: process.env.PORT,
    strictPort: true,
  },
  server: {
    port: process.env.PORT,
    strictPort: true,
    host: true,
    origin: `http://0.0.0.0:${process.env.PORT}`,
    proxy: {
      "/backend": process.env.BACKEND_URL
    }
  }
})
