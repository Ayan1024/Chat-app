import React from 'react'
import Navbar from './components/Navbar'
import {Routes, Route} from "react-router-dom"
import HomePage from "./components/HomePage"

function App() {
  return (
    <div>
  <Navbar/>

  <Routes>
    <Route path='/' element={<HomePage/>} />
  </Routes>
    </div>
  )
}

export default App
