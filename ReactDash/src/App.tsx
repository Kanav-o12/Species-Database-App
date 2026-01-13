import './App.css'
import { Home } from './Pages/Home'
import Page1 from './Pages/AddEntry'
import { EditEntry } from './Pages/EditEntry'
import { AddExcel } from './Pages/AddExcel'
import {HashRouter as Router, Routes, Route } from 'react-router-dom'


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Page1" element={<Page1/>}/>
        <Route path="/AddExcel" element={<AddExcel/>}/>
        <Route path="/EditEntry" element={<EditEntry/>}/>
      </Routes>
    </Router>
  )
}

export default App
