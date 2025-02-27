import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import ProtectRoute from './auth/ProtechRoute'
import LayoutMain from './pages/layouts/LayoutMain'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Home from './Home'
import Control from './pages/control/Control'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route element={<ProtectRoute />}>
          <Route element={<LayoutMain />}>
            <Route path="/" element={<Home />} />
            <Route path="/control" element={<Control />} />
          </Route>
        </Route>


        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App
