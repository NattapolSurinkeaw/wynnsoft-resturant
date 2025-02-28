import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'

axios.interceptors.request.use((request) => {
  request.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;
  request.url = `${import.meta.env.VITE_API_PATH}${request.url}`;
  return request;
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
