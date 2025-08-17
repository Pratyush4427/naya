import React, { useState } from 'react';
import API from '../api';

export default function AddRecipe({ onAdded, user }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Login to add recipes');
    if (!title || !description) return alert('Title and description required');
    try {
      const res = await API.post('/recipes', { title, description, imageUrl });
      onAdded && onAdded(res.data);
      setTitle(''); setDescription(''); setImageUrl('');
    } catch (err) {
      console.error(err);
      alert('Error adding recipe');
    }
  };

  return (
    <div className="card add-recipe">
      <h3>Add Recipe</h3>
      <form onSubmit={submit}>
        <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="input" rows="4" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <input className="input" placeholder="Image URL (optional)" value={imageUrl} onChange={e=>setImageUrl(e.target.value)} />
        <div style={{ marginTop: 10 }}>
          <button className="button button-primary" type="submit">Add Recipe</button>
        </div>
      </form>
    </div>
  );
}
