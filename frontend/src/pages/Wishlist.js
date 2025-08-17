import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

export default function Wishlist({ user }) {
  const [items, setItems] = useState([]);
  const nav = useNavigate();

  useEffect(()=>{
    if (!user) {
      setItems([]);
      return;
    }
    // user.wishlist may be populated when fetched from /users/me
    const fetchMe = async () => {
      try {
        const res = await API.get('/users/me');
        setItems(res.data.wishlist || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMe();
  }, [user]);

  const remove = async (id) => {
    try {
      await API.post(`/recipes/${id}/save`); // toggles
      const res = await API.get('/users/me');
      setItems(res.data.wishlist || []);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) {
      console.error(err);
      alert('Remove failed');
    }
  };

  if (!user) {
    return (
      <div className="container">
        <div className="card center">
          <p className="meta">Login to view your wishlist.</p>
          <button className="button button-primary" onClick={()=>nav('/login')}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h3>Your Wishlist</h3>
      <div style={{ marginTop:12 }}>
        {items.length === 0 && <div className="meta">No saved recipes yet.</div>}
        {items.map(r => (
          <div className="card" key={r._id} style={{ marginBottom:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <Link to={`/recipes/${r._id}`}><h4>{r.title}</h4></Link>
              <div>
                <button className="button button-ghost" onClick={()=>remove(r._id)}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
