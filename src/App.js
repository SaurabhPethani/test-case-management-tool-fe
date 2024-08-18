// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import ProjectPage from './pages/ProjectPage';
import TestCasePage from './pages/TestCasePage';
import PrivateRoute from './PrivateRoute';
import { useAxiosInterceptor } from './services/api';
import { NavigationContextProvider } from './components/NavigationContext';
import AxiosInterceptorComponent from './services/AxiosInterceptorComponent';
import Navbar from './components/Navbar';

function App() {

  const [user, setUser] = useState(null);

  // Logout function
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token'); // Assuming you're storing the JWT in local storage
  };
  const loginElement = <Login setUser={setUser} />;
  return (
    <Router>
      <NavigationContextProvider>
        <AxiosInterceptorComponent />
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={loginElement} />
          <Route path="/login" element={loginElement} />
          <Route path="/projects" element={<PrivateRoute><ProjectPage /></PrivateRoute>} />
          <Route path="/projects/:projectId/testcases" element={<PrivateRoute><TestCasePage /></PrivateRoute>} />
        </Routes>
      </NavigationContextProvider>
    </Router>
  );
}

export default App;
