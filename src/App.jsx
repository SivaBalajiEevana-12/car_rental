
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Components/Home'
import LoginPage from './Components/LoginPage'
import RegisterPage from './Components/RegisterPage'
import NotFound from './Components/NotFound'


function App() {
 

  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/login' element={<LoginPage/>}></Route>
      <Route path='/register' element={<RegisterPage/>}></Route>
      <Route path="*" element={<NotFound/>}></Route>
    </Routes>
  
    </>
  )
}

export default App
