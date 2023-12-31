import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RecipeList from './component/RecipeList';
import IngredientList from './component/IngredientList';
import CreateRecipe from './component/CreateRecipe';
import RecipeDetail from './component/RecipeDetail';
import IngredientDetail from './component/IngredientDetail';



function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <Link to="/">Home</Link>
            <Link to="/ingredients">Ingredients</Link>
            <Link to="/create-recipe">Create Recipe</Link>
          </nav>
          <Routes>
            <Route path="/" element={<RecipeList />} />
            <Route path="/ingredients" element={<IngredientList />} />
            <Route path="/create-recipe" element={<CreateRecipe />} /> 
            <Route path="/recipe/:name" element={<RecipeDetail />} />
            <Route path="/ingredient/:name" element={<IngredientDetail />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
