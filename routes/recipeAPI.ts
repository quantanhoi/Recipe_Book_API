import express from 'express';
import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from '../mikro-orm.config';
import { Rezept } from '../entities/rezept';
import { Bild } from '../entities/bild';
import { Zutat } from '../entities/zutat';
import { Kategorie } from '../entities/kategorie';
import { Ingredient_Amount } from '../entities/ingredient_amount';
import { zutatData } from '../entities/zutatData';
import { RezeptStep } from '../entities/rezeptstep';
import { addZutat, ingredientExistsInRecipe } from '../utils/ultils';

const router = express.Router();

/**
 * @Brief getting all recipe in the database
 */
router.get('/', async (req, res) => {
    const orm = await MikroORM.init(mikroOrmConfig);
    try {
        const em = orm.em.fork();
        const rezeptRepository = em.getRepository(Rezept);
        const bildRepository = em.getRepository(Bild);
        const allRezepte = await rezeptRepository.findAll();
        const response = [];
        for (const element of allRezepte) {
            await element.rezeptSteps.init();
            await element.zutaten.init();
            await element.kategorien.init();
            if (element.Bild) {
                const bild = await bildRepository.findOne({ B_ID: element.Bild.B_ID });
                if (bild) {
                    const rezeptWithURI = { ...element, Bild: bild.URI };
                    response.push(rezeptWithURI);
                }
            }
            else {
                const rezeptWithoutURI = { ...element, Bild: 'n/a' }
                response.push(rezeptWithoutURI);
            }
            /* Since in Rezept there's only B_ID with the type is Bild
            *   We can't just assign URI in bild to B_ID due to difference in type
            *   therefore here instead of writing class Rezept to response
            *   I create a new reponse with custom Rezept which has B_ID replaced with URI
            */
        }
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching Rezepte.');
    } finally {
        await orm.close(true);
    }
});


/**
 * @brief searching for specific recipe using name (case sensitive)
 * @example http://localhost:3000/api/rezept/search?q=Matcha%20Latte
 * 
 */
router.get('/search', async (req, res) => {
    const orm = await MikroORM.init(mikroOrmConfig);
    try {
        const em = orm.em.fork();
        const rezeptRepository = em.getRepository(Rezept);
        const bildRepository = em.getRepository(Bild);
        const query = req.query.q;
        if (typeof query !== 'string') {
            res.status(400).send('Invalid query parameter.');
            return;
        }
        const rezepte = await rezeptRepository.find({ Name: query });
        const response = [];
        for (const element of rezepte) {
            await element.zutaten.init();
            await element.kategorien.init();
            await element.rezeptSteps.init();
            if (element.Bild) {
                const bild = await bildRepository.findOne({ B_ID: element.Bild.B_ID });
                if (bild) {
                    const rezeptWithURI = { ...element, Bild: bild.URI };
                    response.push(rezeptWithURI);
                }
                else {
                    const rezeptWithoutURI = { ...element, Bild: 'n/a' }
                    response.push(rezeptWithoutURI);
                }
            }
        }
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching Rezepte.');
    } finally {
        await orm.close(true);
    }
});


/**
 * @brief add a recipe to the database
 */
router.post('/add', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const orm = await MikroORM.init(mikroOrmConfig);
    console.log("Received POST request data:", req.body);
    try {
        const em = orm.em.fork();
        const data = req.body[0];
        //check if recipe is already in the database
        if(await em.findOne(Rezept, {Name: data.Name})) {
            console.log("Recipe already exists");
            res.status(409).json({message: "Recipe already exists"});
            return;
        }
        //creating new rezept instance and adding data to it
        const newRezept = new Rezept();
        newRezept.Name = data.Name;
        newRezept.Beschreibung = data.Beschreibung;
        newRezept.Rating = data.Rating;
        for (const step of data.rezeptSteps) {
            const newStep = new RezeptStep();
            newStep.Beschreibung = step.Beschreibung;
            newStep.RS_ID = step.RS_ID;
            newRezept.rezeptSteps.add(newStep);
        }
        for (const ingredientData of req.body[0].zutaten) {
            console.log(ingredientData);
            await newRezept.addZutatToNewRecipe(ingredientData, orm);
        }
        for (const categoryData of req.body[0].kategorien) {
            let category = await em.findOne(Kategorie, { Name: categoryData.Name });
            if (!category) {
                category = new Kategorie();
                category.Name = categoryData.Name;
                // Persist new category
                em.persist(category);
                await em.flush();
                let persistedCategory = await em.findOne(Kategorie, { Name: categoryData.Name });
                if (persistedCategory) {
                    category = persistedCategory;
                }
            }
            newRezept.kategorien.add(category);
        }
        // Persist the Rezept entity with its associations
        em.persist(newRezept);
        await em.flush();
        // Retrieve persisted Rezept entity
        const persistedRezept = await em.findOne(Rezept, { Name: newRezept.Name });
        // Update Ingredient_Amount entries with amount and unit
        if (persistedRezept) {
            for (const zutatData of req.body[0].zutaten) {
                const zutatEntity = await em.findOne(Zutat, { Name: zutatData.Name });
                if (zutatEntity) {
                    // Find the corresponding Ingredient_Amount entry
                    const ingredientAmountEntry = await em.findOne(Ingredient_Amount, { rezept: persistedRezept, zutat: zutatEntity });
                    if (ingredientAmountEntry) {
                        // Update amount and unit
                        ingredientAmountEntry.amount = zutatData.amount;
                        ingredientAmountEntry.unit = zutatData.unit;
                        console.log(ingredientAmountEntry);
                        em.persist(ingredientAmountEntry);
                    }
                }
            }
            await em.flush();
        }
        res.status(201).json({ message: 'Rezept added successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while adding Rezepte.');
    }
    finally {
        await orm.close(true);
    }
});

/**
 * @brief add an ingredient to a Recipe
 * @param id id of the Recipe
 */
router.post('/addZutat/:id', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const orm = await MikroORM.init(mikroOrmConfig);
    try {
        const em = orm.em.fork();
        const recipeID = parseInt(req.params.id, 10);
        const recipe = await em.findOne(Rezept, { R_ID: recipeID });
        if (recipe) {
            //first check if the ingredient is already in the recipe, then add later
            const ingredientData: zutatData = req.body as zutatData;
            const ingredient = await addZutat(ingredientData, orm);
            if (ingredient) {
                const ingredientExists = await ingredientExistsInRecipe(ingredient.I_ID, recipe.R_ID, orm);
                if (ingredientExists) {
                    res.status(409).json({ message: "recipe already exists" });
                    //return here, otherwise it will send multiple status to client
                    return;
                }
                else {
                    recipe.zutaten.add(ingredient);
                }
            }
            em.persist(recipe);
            await em.flush();
            const response = [];
            const recipeAfter = await em.findOne(Rezept, {R_ID: recipeID});
            if(recipeAfter) {
                await recipeAfter.zutaten.init();
                response.push(recipeAfter.Name, recipeAfter.R_ID, ...recipeAfter.zutaten);
            }
            res.status(201).json(response);
        }
        //recipe not found
        else {
            res.status(404).json({ message: "recipe not found" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while adding Ingredient.');
    }
    finally {
        await orm.close(true);
    }
});

export default router;