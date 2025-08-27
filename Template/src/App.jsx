import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import "./css/style.css";

import "./charts/ChartjsConfig";

// Import pages
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/Auth/SignIn";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  const { user } = useContext(AppContext);
  return (
    <>
      <Routes>
        {/* Authentification */}
        <Route path="/" element={<SignIn />} />
        <Route path="/reset" element={<SignIn />} />
        <Route path="/changepswd/:token/:email" element={<SignIn />} />
        {user ? (
          <>
            {/* Dashboard */}
            <Route path="/accueil" element={<Dashboard />} />
            <Route path="/cgu" element={<Dashboard />} />
            <Route path="/reinit" element={<Dashboard />} />

            {/* Ma Fiche */}
            <Route path="/mesinformations" element={<Dashboard />} />
            <Route path="/ajout-utilisateur" element={<Dashboard />} />
            <Route path="/liste-utilisateur" element={<Dashboard />} />
            <Route path="/modif-utilisateur/:id" element={<Dashboard />} />
            <Route path="/documents-utilisateurs" element={<Dashboard />} />

            {/* OGC */}
            <Route path="/mesconges" element={<Dashboard />} />
            <Route path="/mesvalidations" element={<Dashboard />} />
            <Route path="/listeconges" element={<Dashboard />} />
            <Route path="/etats" element={<Dashboard />} />

            {/* Projet */}
            <Route path="/creer-projet" element={<Dashboard />} />
            <Route path="/mesprojets" element={<Dashboard />} />

            {/* Mes Feuille de Temps  */}
            <Route path="/list-timesheet" element={<Dashboard />} />
            <Route path="/modify-timesheet/:id" element={<Dashboard />} />
            <Route path="/equipe-timesheet" element={<Dashboard />} />
            <Route path="/messessions" element={<Dashboard />} />
            {/* Feuille de Temps Back-office */}
            <Route path="/all-timesheet" element={<Dashboard />} />

            {/* Social News  */}
            <Route path="/social" element={<Dashboard />} />
            <Route path="/social/groups/:id" element={<Dashboard />} />
            <Route path="/calendar" element={<Dashboard />} />


            {/*  Discussions  */}
            <Route path="/messagerie" element={<Dashboard />} /> 
            
            {/* Mes Notifications */}
            <Route path="/mesnotifications" element={<Dashboard />} />
            {/* Fallback route for authenticated users */}
            <Route path="*" element={<Navigate to="/accueil" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<SignIn />} />
            {/* Fallback route for unauthenticated users */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
