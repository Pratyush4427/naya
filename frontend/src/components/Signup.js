import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Signup({ onLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/signup', { username, email, password });
      const { token, user } = res.data;
      onLogin(token, user);
      nav('/');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth:520, margin:'0 auto' }}>
        <h3 className="center">Create account</h3>
        <form onSubmit={submit}>
          <input className="input" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <div style={{ marginTop:12 }} className="row">
            <button className="button button-primary" type="submit">Signup</button>
          </div>
        </form>
      </div>
    </div>
  );
}
