import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import RecipeDetails from './components/RecipeDetails';
import Wishlist from './pages/Wishlist';
import Login from './components/Login';
import Signup from './components/Signup';
import API from './api';

function App(){
  const [user, setUser] = useState(null);

  // try restore user from localStorage (token + user)
  useEffect(()=> {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      setUser(JSON.parse(userStr));
    } else if (token) {
      // try to fetch /users/me
      API.get('/users/me').then(res=> {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      }).catch(()=> {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
    }
  }, []);

  const onLogin = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={onLogout} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Feed user={user} />} />
          <Route path="/recipes/:id" element={<RecipeDetails user={user} />} />
          <Route path="/wishlist" element={<Wishlist user={user} />} />
          <Route path="/login" element={<Login onLogin={onLogin} />} />
          <Route path="/signup" element={<Signup onLogin={onLogin} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
