#Installation
install node packages
```
npm install express
npm i -s @mikro-orm/core @mikro-orm/mysql @mikro-orm/cli
npm install ts-node
npm install cors
```

Start a mySQL Database on Docker and create an user
```
docker run --name fweRezeptBuch -e MYSQL_ROOT_PASSWORD=start01 -e MYSQL_USER=trung -e MYSQL_PASSWORD=start01 -p 3306:3306 -d mysql

```

Then connect to the database using mySQL Workbench witht the following credentials 
```
Connection Name: FWE_RezeptBuch
Hostname: 127.0.0.1
Port: 3306
Username: root
Password: start01
```

Grant Privileges to user
```
GRANT ALL PRIVILEGES ON *.* TO 'trung'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```
Now you can actually use user trung to create database
```
CREATE DATABASE fwe_rezeptBuch;
```

Then use the database
```
USE fwe_rezeptBuch
```

##Copy and Paste everything in full.sql in querry to create the schema

Example of getting Ingredient Name, Beschreibung, Amount and Unit from a specific Recipe
```
select z.name, z.Beschreibung, ia.amount, ia.unit  from Zutat z 
join Ingredient_Amount ia on z.I_ID = ia.I_ID 
join Rezept r on r.R_ID = ia.R_ID
where r.Name = 'Chicken Fried Rice';
```

example of getting the recipe with specific kategorie and recipe name
```
select k.name, r.name, r.beschreibung 
from Kategorie k
join Kategorie_Rezept kr
on k.name = kr.name
join Rezept r 
on r.r_id = kr.r_id
where k.name = 'Beverages' and r.name = 'Matcha Latte';
```


Let's start with create API
```
npm init -y
npm install @mikro-orm/cli @mikro-orm/core @mikro-orm/mysql @mikro-orm/nestjs express typescript ts-node
```


##Function test 

get all rezept test
```
http://localhost:3000/api/rezept
```

get all zutat

```
http://localhost:3000/api/zutat
```

get specific recipe, %20 is for space
```
http://localhost:3000/api/rezept/search?q=Matcha%20Latte
```







#Error Example
n MikroORM, collections are lazy-loaded by default, which means they are not loaded until you explicitly ask for them.

To load the rezepte collection for a Kategorie, you can use the init() method on the collection. Here's how you can modify your code to load and print the rezepte collection for each Kategorie:
```
const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig);
    try {
        const em = orm.em.fork();
        const entitiesRepository = em.getRepository(Kategorie);
        const allEntities = await entitiesRepository.findAll();
        for (const kategorie of allEntities) {
            
            await kategorie.rezepte.init(); // populate the rezepte collection
            console.log(kategorie);
            
        }
    } catch (error) {
        console.error(error);
    } finally {
        await orm.close(true);
    }
};
```
in this code 
```
await kategorie.rezepte.init();
```
is used tpto load the rezepte collection from the database. After this line, kategorie.rezepte will be initialized and you can use getItems() method to get the items in the collection


#composite primary key and composition
I got a lot of error just for initialize RezeptStep 
in @ManyToOne to Rezept you have to define it as primary key
```
@Entity({tableName: 'RezeptStep'})
export class RezeptStep {
    @PrimaryKey()
    RS_ID!: number;

    @Property()
    Beschreibung!: string;

    @ManyToOne(() => Rezept, { primary: true, fieldName: 'R_ID' })
    rezept!: Rezept;

}
```