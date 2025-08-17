import React from 'react';
import { Link } from 'react-router-dom';

export default function RecipeCard({ recipe, onReact, onSave, currentUser }) {
  const liked = currentUser && recipe.likedBy && recipe.likedBy.find(id => id.toString() === (currentUser.id || currentUser._id).toString());
  const disliked = currentUser && recipe.dislikedBy && recipe.dislikedBy.find(id => id.toString() === (currentUser.id || currentUser._id).toString());
  return (
    <div className="card">
      <Link to={`/recipes/${recipe._id}`}>
        {recipe.imageUrl ? <img src={recipe.imageUrl} alt="" className="recipe-image" /> :
          <div style={{height:180, background:'#eee', borderRadius:8}}/>}
      </Link>
      <h4 style={{marginTop:8}}>{recipe.title}</h4>
      <p className="meta">{recipe.description.slice(0,120)}{recipe.description.length>120?'...':''}</p>
      <div className="actions" style={{ justifyContent:'space-between' }}>
        <div className="meta">👍 {recipe.likes} • 👎 {recipe.dislikes} • 💾 {recipe.savedCount}</div>
        <div className="row">
          <button className="small-btn like" onClick={()=>onReact(recipe._id, 'like')}>
            {liked ? 'Liked' : 'Like'}
          </button>
          <button className="small-btn dislike" onClick={()=>onReact(recipe._id, 'dislike')}>
            {disliked ? 'Disliked' : 'Dislike'}
          </button>
          <button className="small-btn save" onClick={()=>onSave(recipe)}>Save</button>
        </div>
      </div>
    </div>
  );
}
