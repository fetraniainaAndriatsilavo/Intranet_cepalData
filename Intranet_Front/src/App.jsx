import { Route, Routes } from 'react-router-dom'
import './App.css'
import './css/'
// Import Page Login 
import SignIn from './Pages/Auth/SignIn'

function App() {
  return (
    <Routes>
      <Route path='/' element={<SignIn> </SignIn>} />
    </Routes>
  )
}

export default App
