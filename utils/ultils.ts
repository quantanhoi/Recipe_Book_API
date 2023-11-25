
import { MikroORM } from '@mikro-orm/core';
import { Rezept } from '../entities/rezept';
import { Bild } from '../entities/bild';
import { Zutat } from '../entities/zutat';
import { zutatData } from '../entities/zutatData';
import { Ingredient_Amount } from '../entities/ingredient_amount';

// Utility functions
// e.g., export async function addZutat(zutatData: zutatData, orm: MikroORM) { ... }

export { addZutat, ingredientExistsInRecipe };
/**
 * @brief check if the ingredient already exists in the recipe
 * @param I_ID ID of ingredient
 * @param R_ID ID of recipe
 * @param orm mikroorm instance
 * @returns true if exists, false if not 
 */
async function ingredientExistsInRecipe(I_ID: number, R_ID: number, orm: MikroORM) {
    try {
        const em = orm.em.fork();
        const recipe = await em.findOne(Rezept, { R_ID: R_ID });
        const ingredient = await em.findOne(Zutat, { I_ID: I_ID });
        if (!recipe || !ingredient) {
            return false;
        }
        else {
            const ingredientAmount = await em.findOne(Ingredient_Amount, { rezept: recipe, zutat: ingredient });
            if (!ingredientAmount) {
                console.log("Ingredient doesn't exist in the recipe");
                return false;
            }
            else {
                console.log("Ingredient already exists in the recipe");
                return true;
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}




/**
 * @brief adding Ingredient to database (without having a recipe)
 * @param zutatData  ingredient data
 * @param orm mikroorm instance
 * @returns ingredient data fetched from database
 */
async function addZutat(zutatData: zutatData, orm: MikroORM) {
    try {
        const em = orm.em.fork();
        let ingredient = await em.findOne(Zutat, { Name: zutatData.Name });
        if (!ingredient) {
            ingredient = new Zutat();
            ingredient.Name = zutatData.Name;
            ingredient.Beschreibung = zutatData.Beschreibung;
            em.persist(ingredient);
            await em.flush();
            console.log("persisted new ingredient " + ingredient.Name);
            let persistedIngredient = await em.findOne(Zutat, { Name: zutatData.Name });
            if (persistedIngredient) {
                ingredient = persistedIngredient;
            }
        }
        return ingredient;
    }
    catch (error) {
        console.log(error);
    }
}
