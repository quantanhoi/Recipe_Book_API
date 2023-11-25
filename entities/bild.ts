import { Entity, PrimaryKey, Property  } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';

@Entity({tableName: 'Bild'})
export class Bild {
    @PrimaryKey({fieldName: 'B_ID'})
    B_ID!: number;

    @Property({fieldName: 'URI'})
    URI!: string;

    @Property({fieldName: 'Beschreibung'})
    Beschreibung!: string;
}