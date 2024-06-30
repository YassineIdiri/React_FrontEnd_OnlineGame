import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';
import Header from './components/Header';
import Register from './pages/Register';
import Login from './pages/Login';
import ProfilePage from './pages/ProfilePage';
import Grid from './pages/Grid';
import Error from './components/Error';
import './style.css';

const App = () => {
  const [connexion, setConnexion] = useState(() => {
    // Récupérer l'état de connexion depuis le localStorage
    const savedConnexion = localStorage.getItem('connexion');
    return savedConnexion ? JSON.parse(savedConnexion) : false;
});

useEffect(() => {
  // Sauvegarder l'état de connexion dans le localStorage
  localStorage.setItem('connexion', JSON.stringify(connexion));
}, [connexion]);

    return (
        <Router>
            <Header connexion={connexion} setConnexion={setConnexion} />
            <Routes>
                <Route path="/login" element={connexion ? (<Grid />) : (<Login connexion={connexion} setConnexion={setConnexion} />)} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={connexion ? (<ProfilePage />) : (<Navigate to="/login" />)}/>
                <Route path="/" element={connexion ? (<Grid />) : (<Navigate to="/login" />)}/>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
