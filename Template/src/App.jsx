import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import SignIn from './pages/Auth/SignIn';
function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes> 
        {/* Authentification */}
        <Route path='/' element={<SignIn />} />
        <Route path='/reset' element={<SignIn />} /> 
        <Route path='/changepswd' element={<SignIn /> } /> 

        {/* Dashboard */}
        <Route exact path="/accueil" element={<Dashboard />} /> 
        <Route path='/cgu' element={<Dashboard />} /> 
        <Route path='/reinit' element={<Dashboard />} />   

        {/* Ma Fiche */}
        <Route path='/mesinformations' element={<Dashboard />} /> 
        <Route path='/ajout-utilisateur' element={<Dashboard /> } /> 
        <Route path='/liste-utilisateur' element={<Dashboard /> } /> 
        
        {/* OGC  */} 
        <Route path='/mesconges' element={<Dashboard />} /> 
        <Route path='/mesvalidations' element={<Dashboard />} />  
        <Route path='/listeconges' element={<Dashboard />} />  
        <Route path='/etats' element={<Dashboard />} />  


      </Routes>
    </>
  );
}

export default App;
