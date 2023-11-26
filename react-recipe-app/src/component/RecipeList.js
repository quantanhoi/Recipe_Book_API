import React, { useState, useEffect } from 'react';
import '../css/RecipeList.css';


const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    /**
     * @brief handling search recipe, recipe name is case sensitive here, also need full name
     */
    const handleSearch = async () => {
        setIsLoading(true);
        try {
            //if searchTerm is empty, return full list instead
            if (searchTerm.trim() === '') {
                const allRecipesResponse = await fetch('http://localhost:3000/api/rezept');
                if (!allRecipesResponse.ok) {
                    throw new Error(`HTTP error! status: ${allRecipesResponse.status}`);
                }
                const allRecipesData = await allRecipesResponse.json();
                setRecipes(allRecipesData);
            }
            else {
                const encodedSearchTerm = encodeURIComponent(searchTerm);
                const response = await fetch(`http://localhost:3000/api/rezept/search?q=${encodedSearchTerm}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setRecipes(data);
            }

        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/rezept')
                if (!response.ok) {
                    console.log("fetching failed");
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setRecipes(data);
                setIsLoading(false);
            } catch (e) {
                setError(e.message);
                setIsLoading(false);
            }
        };
        fetchRecipes();
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading recipes: {error}</p>;

    return (
        <div>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <h1>Recipes</h1>
            {recipes.length > 0 ? (
                <ul className="recipe-list">
                    {recipes.map((recipe, index) => (
                        <li key={index} className="recipe-item">
                            <h2>{recipe.Name}</h2>
                            <p>{recipe.Beschreibung}</p>
                            {/* You can add other details here */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No recipes found.</p>
            )}
        </div>
    );
};

export default RecipeList;
