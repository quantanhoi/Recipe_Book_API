import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../css/RecipeList.css';

const IngredientDetail = () => {
    const [ingredientDetail, setIngredientDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();

    useEffect(() => {
        const fetchIngredientDetail = async () => {
            try {
                const ingredientName = params.name;
                const response = await fetch(`http://localhost:3000/api/zutat/search?q=${encodeURIComponent(ingredientName)}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setIngredientDetail(data.length > 0 ? data[0] : null);
            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchIngredientDetail();
    }, [params.name]);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading ingredient details: {error}</p>;
    if (!ingredientDetail) return <p>Ingredient not found</p>;

    return (
        <div >
            <h1>{ingredientDetail.Name}</h1>
            <h2>Recipes Using This Ingredient:</h2>
            <ul className='recipe-list'>
                {ingredientDetail.rezepte.map((recipe, index) => (
                    <li className='recipe-item' key={index}>
                        <Link to={`/recipe/${encodeURIComponent(recipe.Name)}`}>
                            <h3>{recipe.Name}</h3>
                        </Link>
                        <p>{recipe.Beschreibung}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default IngredientDetail;
