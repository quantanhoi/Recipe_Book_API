import { MikroORM } from '@mikro-orm/core';
import { Bild } from './entities/bild';
import { Ingredient_Amount } from './entities/ingredient_amount';
import { Kategorie } from './entities/kategorie';
import { Rezept } from './entities/rezept';
import { RezeptStep } from './entities/rezeptstep';
import { Zutat } from './entities/zutat';

export default {
    entities: [Bild, Ingredient_Amount, Kategorie, Rezept, RezeptStep, Zutat],
    dbName: 'fwe_rezeptBuch',
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'start01',
    debug: true,
} as Parameters<typeof MikroORM.init>[0];
