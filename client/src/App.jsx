import React from 'react'
import Login from './components/Login'
import Signup from './components/Signup'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Inventory from './components/Inventory'
import Home from './components/Home'


function App() {
  return (
    <div>


      <BrowserRouter>
        <Routes>

          <Route path='/' element={<Home />} />
          <Route path='/inventory' element={<Inventory />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />

        </Routes>

      </BrowserRouter>


    </div>
  )
}

export default App