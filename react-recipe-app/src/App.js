import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RecipeList from './component/RecipeList';
import IngredientList from './component/IngredientList';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <Link to="/">Home</Link>
            <Link to="/ingredients">Ingredients</Link>
          </nav>
          <Routes>
            <Route path="/" element={<RecipeList />} />
            <Route path="/ingredients" element={<IngredientList />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
