import { Entity, PrimaryKey, Collection, OneToMany, ManyToMany } from '@mikro-orm/core';
import { Rezept } from './rezept';
import { KategorieRezept } from './kategorie_rezept';

@Entity({tableName : 'Kategorie'})
export class Kategorie {
    @PrimaryKey()
    Name!: string;

    // @OneToMany(() => KategorieRezept, kr => kr.kategorie)
    // kategorieRezepte = new Collection<KategorieRezept>(this);
    @ManyToMany({entity: () => Rezept, pivotEntity: () => KategorieRezept})
    rezepte = new Collection<Rezept>(this);

}