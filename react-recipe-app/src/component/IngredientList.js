import React, { useState, useEffect } from 'react';
import '../css/IngredientList.css';
import { Link } from 'react-router-dom';

const IngredientList = () => {
    const [ingredients, setIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch all ingredients initially
    useEffect(() => {
        const fetchIngredients = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:3000/api/zutat');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setIngredients(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchIngredients();
    }, []); // Empty dependency array to only run once on component mount

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const encodedSearchTerm = encodeURIComponent(searchTerm);
            const url = searchTerm.trim() ? `http://localhost:3000/api/zutat/search?q=${encodedSearchTerm}` : 'http://localhost:3000/api/zutat';
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setIngredients(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading ingredients: {error}</p>;
    if (!ingredients.length) return <p>No ingredients found</p>;

    return (
        <div>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search ingredients..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <h1>Ingredients</h1>
            <ul className="ingredient-list">
                {ingredients.map((ingredient, index) => (
                    <li key={index} className="ingredient-item">
                        <Link to={`/ingredient/${ingredient.Name}`}>
                            <h2>{ingredient.Name}</h2>
                        </Link>
                        {/* Add other ingredient details here */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default IngredientList;
