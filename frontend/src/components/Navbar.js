import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  return (
    <div className="container">
      <div className="navbar" style={{ marginBottom: 18 }}>
        <div className="brand">
          <div className="logo">RS</div>
          <div>
            <div style={{ fontWeight:800 }}>RecipeShare</div>
            <div style={{ fontSize:12, color:'#666' }}>Share. Cook. Enjoy.</div>
          </div>
        </div>

        <div className="nav-links">
          <Link to="/">Feed</Link>
          <Link to="/wishlist">Wishlist</Link>
          {user ? (
            <div className="auth-area">
              <div style={{ textAlign:'right' }}>
                <div style={{ fontWeight:700 }}>{user.username}</div>
                <div style={{ fontSize:12, color:'#666' }}>{user.email}</div>
              </div>
              <button className="button button-ghost" onClick={onLogout}>Logout</button>
            </div>
          ) : (
            <div className="auth-area">
              <Link to="/login">Login</Link>
              <Link to="/signup" style={{ marginLeft:8 }}><button className="button button-primary">Signup</button></Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
