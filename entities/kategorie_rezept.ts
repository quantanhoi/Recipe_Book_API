import { Entity, PrimaryKey, ManyToOne  } from '@mikro-orm/core';
import { Kategorie } from './kategorie';
import { Rezept } from './rezept';



@Entity({tableName : 'Kategorie_Rezept'})
export class KategorieRezept {
    @ManyToOne({ entity: () => Kategorie, primary: true, fieldName: 'Name' })
    kategorie!: Kategorie;

    @ManyToOne({ entity: () => Rezept, primary: true, fieldName: 'R_ID' })
    rezept!: Rezept;
}
