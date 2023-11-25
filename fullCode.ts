import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from './mikro-orm.config';
import { Bild } from './entities/bild';
import { Ingredient_Amount } from './entities/ingredient_amount';
import { Kategorie } from './entities/kategorie';
import { Rezept } from './entities/rezept';
import { RezeptStep } from './entities/rezeptstep';
import { Zutat } from './entities/zutat';
import { zutatData } from './entities/zutatData';


import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

/**
 * @Brief getting all recipe in the database
 */
app.get('/api/rezept', async (req, res) => {
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
                else {
                    const rezeptWithoutURI = { ...element, Bild: 'n/a' }
                    response.push(rezeptWithoutURI);
                }
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
 * @brief getting all ingredients from the database
 */
app.get('/api/zutat', async (req, res) => {
    const orm = await MikroORM.init(mikroOrmConfig);
    try {
        const em = orm.em.fork();
        const zutatRepository = em.getRepository(Zutat);
        const bildRepository = em.getRepository(Bild);
        const allZutaten = await zutatRepository.findAll();
        const response = [];
        for (const element of allZutaten) {
            await element.rezepte.init();
            if (element.Bild) {
                const bild = await bildRepository.findOne({ B_ID: element.Bild.B_ID });
                if (bild) {
                    const zutatWithURI = { ...element, Bild: bild.URI };
                    response.push(zutatWithURI);
                }
                else {
                    const zutatWithoutURI = { ...element, Bild: 'n/a' }
                    response.push(zutatWithoutURI);
                }
            }
        }
        res.json(response);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('An error occured while fetching Zutaten.');
    }
    finally {
        await orm.close(true);
    }

});


/**
 * @brief searching for specific recipe using name (case sensitive)
 * @example http://localhost:3000/api/rezept/search?q=Matcha%20Latte
 * 
 */
app.get('/api/rezept/search', async (req, res) => {
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
 * @brief search for ingredient using its name
 * @example http://localhost:3000/api/zutat/search?q=Milk
 */
app.get('/api/zutat/search', async (req, res) => {
    const orm = await MikroORM.init(mikroOrmConfig);
    try {
        const em = orm.em.fork();
        const zutatRepository = em.getRepository(Zutat);
        const bildRepository = em.getRepository(Bild);
        const query = req.query.q;
        if (typeof query !== 'string') {
            res.status(400).send('Invalid query parameter.');
            return;
        }
        const zutat = await zutatRepository.find({ Name: query });
        const response = [];
        for (const element of zutat) {
            element.rezepte.init();
            if (element.Bild) {
                const bild = await bildRepository.findOne({ B_ID: element.Bild.B_ID });
                if (bild) {
                    const zutatWithURI = { ...element, Bild: bild.URI };
                    response.push(zutatWithURI);
                }
                else {
                    const zutatWithoutURI = { ...element, Bild: 'n/a' }
                    response.push(zutatWithoutURI);
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
app.post('/api/rezept/add', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const orm = await MikroORM.init(mikroOrmConfig);
    try {
        const em = orm.em.fork();
        const data = req.body[0];
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
 * @brief Add an ingredient to the DATABASE
 */
app.post('/api/zutat/add', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const orm = await MikroORM.init(mikroOrmConfig);
    try {
        let ingredient = await addZutat(req.body[0], orm);
        if (ingredient) {
            console.log(ingredient);
            res.status(201).json({ message: 'Zutat added successfully: ' + ingredient.Name });
        }
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
app.post('/api/rezept/addZutat/:id', async (req, res) => {
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






app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});