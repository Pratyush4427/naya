import React, { useEffect, useState } from 'react';
import API from '../api';
import RecipeCard from './RecipeCard';
import AddRecipe from './AddRecipe';

export default function Feed({ user }) {
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = async () => {
    try {
      const res = await API.get('/recipes');
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
      alert('Error loading recipes');
    }
  };

  useEffect(()=>{ fetchRecipes(); }, []);

  const handleAdded = (newRecipe) => {
    setRecipes(prev => [newRecipe, ...prev]);
  };

  const handleReact = async (id, action) => {
    try {
      await API.post(`/recipes/${id}/react`, { action });
      fetchRecipes();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'React failed (login required?)');
    }
  };

  const handleSave = async (recipe) => {
    if (!user) return alert('Login to save recipes');
    try {
      await API.post(`/recipes/${recipe._id}/save`);
      // refresh recipes and user wishlist
      fetchRecipes();
      const me = await API.get('/users/me');
      localStorage.setItem('user', JSON.stringify(me.data));
      alert('Toggled save');
    } catch (err) {
      console.error(err);
      alert('Save failed');
    }
  };

  return (
    <div>
      <AddRecipe onAdded={handleAdded} user={user} />
      <div>
        <div className="feed-grid">
          {recipes.map(r => (
            <RecipeCard key={r._id} recipe={r} onReact={handleReact} onSave={handleSave} currentUser={user} />
          ))}
        </div>
      </div>
    </div>
  );
}
