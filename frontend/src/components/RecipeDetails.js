import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

export default function RecipeDetails({ user }) {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [comment, setComment] = useState('');

  const fetchRecipe = async () => {
    try {
      const res = await API.get(`/recipes/${id}`);
      setRecipe(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(()=>{ fetchRecipe(); }, [id]);

  const submitComment = async () => {
    if (!user) return alert('Login to comment');
    if (!comment) return;
    try {
      await API.post(`/recipes/${id}/comment`, { text: comment });
      setComment('');
      fetchRecipe();
    } catch (err) { console.error(err); alert('Comment failed'); }
  };

  const react = async (action) => {
    if (!user) return alert('Login to react');
    try {
      await API.post(`/recipes/${id}/react`, { action });
      fetchRecipe();
    } catch (err) { console.error(err); alert('React failed'); }
  };

  const toggleSave = async () => {
    if (!user) return alert('Login to save');
    try {
      const res = await API.post(`/recipes/${id}/save`);
      // update local user object
      const me = await API.get('/users/me');
      localStorage.setItem('user', JSON.stringify(me.data));
      setRecipe(res.data.recipe || recipe);
      alert('Toggled save');
    } catch (err) { console.error(err); alert('Save failed'); }
  };

  if (!recipe) return <div className="container">Loading...</div>;

  const liked = user && recipe.likedBy && recipe.likedBy.find(id => id.toString() === (user.id || user._id).toString());
  const disliked = user && recipe.dislikedBy && recipe.dislikedBy.find(id => id.toString() === (user.id || user._id).toString());

  return (
    <div className="container">
      <div className="card">
        <div className="detail-hero">
          {recipe.imageUrl ? <img src={recipe.imageUrl} alt="" /> : <div style={{width:360, height:240, borderRadius:10, background:'#eee'}}/>}
          <div style={{ flex:1 }}>
            <h2>{recipe.title}</h2>
            <div className="meta">{new Date(recipe.createdAt).toLocaleString()}</div>
            <p style={{ marginTop:12 }}>{recipe.description}</p>

            <div style={{ marginTop:12 }} className="row">
              <button className="small-btn like" onClick={()=>react('like')}>{liked ? 'Liked' : 'Like'} ({recipe.likes})</button>
              <button className="small-btn dislike" onClick={()=>react('dislike')}>{disliked ? 'Disliked' : 'Dislike'} ({recipe.dislikes})</button>
              <button className="small-btn save" onClick={toggleSave}>Save ({recipe.savedCount})</button>
            </div>
          </div>
        </div>

        <div style={{ marginTop:20 }}>
          <h4>Comments</h4>
          {recipe.comments && recipe.comments.length ? recipe.comments.map((c, i)=>(
            <div key={i} className="comment">
              <div className="who">{c.author?.username || 'User'}</div>
              <div style={{ marginTop:6 }}>{c.text}</div>
              <div className="when">{new Date(c.createdAt).toLocaleString()}</div>
            </div>
          )) : <div className="meta">No comments yet</div>}

          <div style={{ marginTop:12 }}>
            <textarea className="input" rows="3" placeholder="Add a comment" value={comment} onChange={e=>setComment(e.target.value)} />
            <div style={{ marginTop:8 }}>
              <button className="button button-primary" onClick={submitComment}>Post Comment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
