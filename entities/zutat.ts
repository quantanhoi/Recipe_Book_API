import { Entity, PrimaryKey, Property, OneToMany, OneToOne, Collection, ManyToMany } from '@mikro-orm/core';
import { Bild } from './bild';
import { Ingredient_Amount } from './ingredient_amount'
import { Rezept } from './rezept';

@Entity({tableName : 'Zutat'})
export class Zutat {
    @PrimaryKey()
    I_ID!: number;

    @Property()
    Name!: string;

    @Property({default: 'n/a'})
    Beschreibung?: string;

    @OneToOne(() => Bild, {nullable: true, default: 'n/a', fieldName: 'B_ID'})
    Bild?: Bild;

    @ManyToMany({entity: () => Rezept, mappedBy : r => r.zutaten})
    rezepte = new Collection<Rezept>(this);
}