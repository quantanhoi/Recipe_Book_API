import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const RecipeDetail = () => {
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();

    useEffect(() => {
        const fetchRecipeDetail = async () => {
            try {
                const recipeName = params.name;
                const response = await fetch(`http://localhost:3000/api/rezept/search?q=${encodeURIComponent(recipeName)}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setRecipe(data.length > 0 ? data[0] : null);
            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecipeDetail();
    }, [params.name]);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading recipe: {error}</p>;
    if (!recipe) return <p>Recipe not found</p>;

    return (
        <div>
            <h1>{recipe.Name}</h1>
            <p>{recipe.Beschreibung}</p>
            <h2>Ingredients</h2>
            <ul>
                {recipe.zutaten.map((zutat, index) => (
                    <li key={index}>
                        <strong>{zutat.Name}</strong> ({zutat.Beschreibung}): {zutat.amount} {zutat.unit}
                    </li>
                ))}
            </ul>
            <h2>Steps</h2>
            <ol>
                {recipe.rezeptSteps.map((step, index) => (
                    <li key={index}>{step.Beschreibung}</li>
                ))}
            </ol>
        </div>
    );
};

export default RecipeDetail;
