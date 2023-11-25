import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Rezept } from './rezept';


@Entity({tableName: 'RezeptStep'})
export class RezeptStep {
    @PrimaryKey({fieldName: 'RS_ID'})
    RS_ID!: number;

    @Property({fieldName: 'Beschreibung'})
    Beschreibung!: string;

    @ManyToOne(() => Rezept, { primary: true, fieldName: 'R_ID' })
    rezept!: Rezept;

}