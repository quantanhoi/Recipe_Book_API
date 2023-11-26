import React, { useState } from 'react';
import '../css/CreateRecipe.css';
const CreateRecipe = () => {
    const [recipe, setRecipe] = useState({
        Name: '',
        Beschreibung: '',
        Rating: 0,
    });


    //Category
    const [kategorieInputs, setKategorieInputs] = useState([{ Name: '' }]);
    const handleKategorieChange = (index, event) => {
        const newKategorieInputs = kategorieInputs.map((input, i) => {
            if (i === index) {
                return { Name: event.target.value };
            }
            return input;
        });
        setKategorieInputs(newKategorieInputs);
    };

    const handleAddKategorieField = () => {
        setKategorieInputs([...kategorieInputs, { Name: '' }]);
    };

    const handleChange = (e) => {
        setRecipe({ ...recipe, [e.target.name]: e.target.value });
    };

    //Rezept Step and Zutat
    const [rezeptSteps, setRezeptSteps] = useState([{ RS_ID: 1, Beschreibung: '' }]);
    const [zutaten, setZutaten] = useState([{ Name: '', Beschreibung: '', amount: '', unit: '' }]);

    const handleRezeptStepsChange = (index, e) => {
        const newRezeptSteps = [...rezeptSteps];
        newRezeptSteps[index][e.target.name] = e.target.value;
        setRezeptSteps(newRezeptSteps);
    };

    const handleZutatenChange = (index, e) => {
        const newZutaten = [...zutaten];
        newZutaten[index][e.target.name] = e.target.value;
        setZutaten(newZutaten);
    };

    const addRezeptStep = () => {
        setRezeptSteps([...rezeptSteps, { RS_ID: rezeptSteps.length + 1, Beschreibung: '' }]);
    };

    const addZutat = () => {
        setZutaten([...zutaten, { Name: '', Beschreibung: '', amount: '', unit: '' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const recipeData = {
                ...recipe,
                kategorien: kategorieInputs
                        .map(input => ({ Name: input.Name.trim() }))
                        .filter(category => category.Name !== ''),
                rezeptSteps,
                zutaten
            };
            console.log([recipeData]);
            const response = await fetch('http://localhost:3000/api/rezept/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([recipeData]) // API expects an array

            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Recipe added:', data);
            // Reset form or redirect user as necessary
        } catch (error) {
            console.error('Error adding recipe:', error);
        }
    };







    return (
        <div>
            <h1>Create a New Recipe</h1>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label>Name:</label>
                    <input type="text" name="Name"
                        placeholder="Recipe Name"
                        value={recipe.Name} onChange={handleChange} />
                </div>
                <div className='form-group'>
                    <label>Description:</label>
                    <input name="Beschreibung"
                        placeholder="Description"
                        value={recipe.Beschreibung} onChange={handleChange}></input>
                </div>
                <div className='form-group'>
                    <label>Rating:</label>
                    <input type="number" name="Rating"
                        placeholder="Rating"
                        value={recipe.Rating} onChange={handleChange} />
                </div>
                {/* Category Inputs */}
                {kategorieInputs.map((input, index) => (
                    <div key={index} className='form-group'>
                        <label>Category {index + 1}:</label>
                        <input
                            type="text"
                            value={input.Name}
                            placeholder="Category Name"
                            onChange={(e) => handleKategorieChange(index, e)}
                        />
                    </div>
                ))}
                <button type="button" onClick={handleAddKategorieField}>+ Add Category</button>
                {/* Rezept Steps Inputs */}
                {rezeptSteps.map((step, index) => (
                    <div key={index} className='form-group'>
                        <label>Step {index + 1}:</label>
                        <input
                            type="text"
                            name="Beschreibung"
                            value={step.Beschreibung}
                            onChange={(e) => handleRezeptStepsChange(index, e)}
                        />
                    </div>
                ))}
                <button type="button" onClick={addRezeptStep}>Add Step</button>
                {/* Zutaten Inputs */}
                {zutaten.map((zutat, index) => (
                    <div key={index} className='form-group'>
                        <label>Ingredient {index + 1}:</label>
                        <input
                            type="text"
                            name="Name"
                            placeholder="Ingredient Name"
                            value={zutat.Name}
                            onChange={(e) => handleZutatenChange(index, e)}
                        />
                        <input
                            type="text"
                            name="Beschreibung"
                            placeholder="Description"
                            value={zutat.Beschreibung}
                            onChange={(e) => handleZutatenChange(index, e)}
                        />
                        <input
                            type="text"
                            name="amount" 
                            placeholder="Amount"
                            value={zutat.amount}
                            onChange={(e) => handleZutatenChange(index, e)}
                        />
                        <input
                            type="text"
                            name="unit" 
                            placeholder="Unit"
                            value={zutat.unit}
                            onChange={(e) => handleZutatenChange(index, e)}
                        />
                    </div>
                ))}
                <button type="button" onClick={addZutat}>Add Ingredient</button>
                <button type="submit">Add Recipe</button>
            </form>
        </div>
    );
};

export default CreateRecipe;
