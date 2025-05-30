import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import axios from 'axios'
import './App.css'
import { Provider } from 'react-redux'
import { store } from './store/store.jsx'

axios.interceptors.request.use((request) => {
  request.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;
  request.url = `${import.meta.env.VITE_API_PATH}${request.url}`;
  return request;
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
