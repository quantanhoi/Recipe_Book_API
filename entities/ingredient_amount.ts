import { Entity, PrimaryKey, Property, ManyToOne} from '@mikro-orm/core';
import { Zutat } from './zutat';
import {Rezept} from './rezept';

@Entity({tableName: 'Ingredient_Amount'})
export class Ingredient_Amount {
    @Property({fieldName: 'amount'})
    amount!: number;

    @Property({fieldName: 'unit'})
    unit!: string;

    @ManyToOne({entity: () => Rezept, primary: true, fieldName: 'R_ID'})
    rezept!: Rezept;

    @ManyToOne({entity: () => Zutat, primary: true, fieldName: 'I_ID'})
    zutat!: Zutat;
}