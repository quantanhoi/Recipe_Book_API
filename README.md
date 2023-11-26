# Installation
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

## Copy and Paste everything in full.sql in querry to create the schema

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


## Function test (GET)
Here I used Postman to test the api methos with API test set

Get all rezept test
```
http://localhost:3000/api/rezept
```

Get all zutat

```
http://localhost:3000/api/zutat
```

Get specific recipe, %20 is for space
```
http://localhost:3000/api/rezept/search?q=Matcha%20Latte
```

Get an ingredient and its related recipe 
```
http://localhost:3000/api/zutat/search?q=Milk
```

## Function Test (POST)

Use Data in /testData/


Add a new recipe to the database
Testing with an already existing category: use data from testNewRezept.json
```
http://localhost:3000/api/rezept/add
```
Testing with non existing category: use data from testNewRezeptUndCategory.json

Add a new ingredient to the database
Use data in testNewZutat.json
```
http://localhost:3000/api/zutat/add
```

Add a new ingredient to an existing recipe
Use data in testNewZutatRecipe.json, :id is the R_ID of recipe
```
http://localhost:3000/api/rezept/addZutat/:id
```

Deleting a Recipe
There are 2 ways to do this, either deleting it by id or by name
I implemented both here because the id is auto_incremented, so in some cases it will be hard to find the recipe because we don't know ID until the recipe is created
But the name is well-known

Delete a recipe by its name
```
http://localhost:3000/api/rezept/delete?name=Instant%20Ramen
```

Delete a recipe by its ID
```
http://localhost:3000/api/rezept/delete/{id}
```
# not yet fullfilled
UI for deleting recipes



