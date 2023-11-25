import express from 'express';
import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from '../mikro-orm.config';
import { Rezept } from '../entities/rezept';
import { Bild } from '../entities/bild';
import { Zutat } from '../entities/zutat';
import { zutatData } from '../entities/zutatData';
import { addZutat } from '../utils/ultils';

const router = express.Router();

/**
 * @brief getting all ingredients from the database
 */
router.get('/', async (req, res) => {
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
 * @brief search for ingredient using its name
 * @example http://localhost:3000/api/zutat/search?q=Milk
 */
router.get('/api/zutat/search', async (req, res) => {
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
 * @brief Add an ingredient to the DATABASE
 */
router.post('/api/zutat/add', async (req, res) => {
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
export default router;