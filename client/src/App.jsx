import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Signin from './pages/Signin';
import Register from './pages/Register';
import Layout from './components/Layout';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
      
      <Route path="signin" element={<Signin />}></Route>
      <Route path="register" element={<Register />}></Route>
    </Routes>
  )
}

export default App
