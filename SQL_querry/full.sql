/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     11/15/2023 10:14:07 AM                       */
/*==============================================================*/
alter table Ingredient_Amount
drop foreign key FK_INGREDIE_INGREDIEN_ZUTAT;

alter table Ingredient_Amount
drop foreign key FK_INGREDIE_REZEPT_IN_REZEPT;

alter table Kategorie_Rezept
drop foreign key FK_KATEGORI_KATEGORIE_KATEGORI;

alter table Kategorie_Rezept
drop foreign key FK_KATEGORI_KATEGORIE_REZEPT;

alter table Rezept
drop foreign key FK_REZEPT_REFERENCE_BILD;

alter table RezeptStep
drop foreign key FK_REZEPTST_REZEPT_RE_REZEPT;

alter table Zutat
drop foreign key FK_ZUTAT_REFERENCE_BILD;





drop table if exists Bild;
drop table if exists RezeptStep;
drop table if exists Zutat;
drop table if exists Rezept;
drop table if exists Ingredient_Amount;
drop table if exists Kategorie;
drop table if exists Kategorie_Rezept;

/*==============================================================*/
/* Table: Bild                                                  */
/*==============================================================*/
create table
   Bild (
      URI text not null ,
      Beschreibung text ,
      B_ID bigint not null ,
      primary key (B_ID)
   );

/*==============================================================*/
/* Table: Ingredient_Amount                                     */
/*==============================================================*/
create table
   Ingredient_Amount (
      R_ID bigint not null ,
      I_ID bigint not null ,
      amount numeric(8, 0) ,
      unit text ,
      primary key (R_ID, I_ID)
   );

/*==============================================================*/
/* Table: Kategorie                                             */
/*==============================================================*/
create table
   Kategorie (
      Name varchar(255) not null,
      primary key (Name)
   );

/*==============================================================*/
/* Table: Kategorie_Rezept                                      */
/*==============================================================*/
create table
   Kategorie_Rezept (
      Name varchar(255) not null,
      R_ID bigint not null ,
      primary key (Name, R_ID)
   );

/*==============================================================*/
/* Table: Rezept                                                */
/*==============================================================*/
create table
   Rezept (
      Name text ,
      Beschreibung text ,
      Rating int ,
      R_ID bigint not null ,
      B_ID bigint ,
      primary key (R_ID)
   );

/*==============================================================*/
/* Table: RezeptStep                                            */
/*==============================================================*/
create table
   RezeptStep (
      R_ID bigint not null ,
      RS_ID int not null ,
      Beschreibung text ,
      primary key (R_ID, RS_ID)
   );

/*==============================================================*/
/* Table: Zutat                                                 */
/*==============================================================*/
create table
   Zutat (
      I_ID bigint not null ,
      B_ID bigint ,
      Name text ,
      Beschreibung text ,
      primary key (I_ID)
   );

ALTER TABLE Bild MODIFY B_ID bigint NOT NULL AUTO_INCREMENT;
ALTER TABLE Rezept MODIFY R_ID bigint NOT NULL AUTO_INCREMENT;
ALTER TABLE Zutat MODIFY I_ID bigint NOT NULL AUTO_INCREMENT;

alter table Ingredient_Amount add constraint FK_INGREDIE_INGREDIEN_ZUTAT foreign key (I_ID) references Zutat (I_ID) on delete restrict on update restrict;

alter table Ingredient_Amount add constraint FK_INGREDIE_REZEPT_IN_REZEPT foreign key (R_ID) references Rezept (R_ID) on delete cascade on update cascade;

alter table Kategorie_Rezept add constraint FK_KATEGORI_KATEGORIE_KATEGORI foreign key (Name) references Kategorie (Name) on delete restrict on update restrict;

alter table Kategorie_Rezept add constraint FK_KATEGORI_KATEGORIE_REZEPT foreign key (R_ID) references Rezept (R_ID) on delete cascade on update cascade;

alter table Rezept add constraint FK_REZEPT_REFERENCE_BILD foreign key (B_ID) references Bild (B_ID) on delete restrict on update restrict;

alter table RezeptStep add constraint FK_REZEPTST_REZEPT_RE_REZEPT foreign key (R_ID) references Rezept (R_ID) on delete restrict on update restrict;

alter table Zutat add constraint FK_ZUTAT_REFERENCE_BILD foreign key (B_ID) references Bild (B_ID) on delete restrict on update restrict;



/*==============================================================*/
/* Pumpkin Spice Latte                                          */
/*==============================================================*/
INSERT INTO
   Bild (URI, Beschreibung, B_ID)
VALUES
   (
      'https://cdn.discordapp.com/attachments/1168685873903177840/1174280644134711346/pumkin-spice-latte.png?ex=65670512&is=65549012&hm=6ed70747e4f36f5b8280fbf9c3d5e36c45a81b76a96eafcf8678cba108a94194&',
      'Image for Pumpkin Spice Latte',
      1
   ),
   (
      'https://cdn.discordapp.com/attachments/1168685873903177840/1174280644797403166/Homemade-Pumpkin-Puree-7927.png?ex=65670512&is=65549012&hm=7e040a7d26772f3d1ecf4db0171461a312ebec09688b6edfd37499260d29478b&',
      'Image for Pumpkin Puree',
      2
   ),
   (
      'https://cdn.discordapp.com/attachments/1168685873903177840/1174280645422370817/l-intro-1645231221.png?ex=65670512&is=65549012&hm=5a7151a51123fa72f0e63b70c0c3b1da424f4a8fd5d9652ec75777956d6d413a&',
      'Image for Coffee',
      3
   ),
   (
      'https://cdn.discordapp.com/attachments/1168685873903177840/1174280645996982282/GettyImages-1413944242-79c406e0bbe4435596bc671f95a949cb.png?ex=65670513&is=65549013&hm=e3a3084018b545c81f121d8c60af9cc6f2d9827ee9d23795ac03b6aad8e0dce3&',
      'Image for Milk',
      4
   ),
   (
      'https://cdn.discordapp.com/attachments/1168685873903177840/1174280646370283560/hero-image-1-800x533.png?ex=65670513&is=65549013&hm=b9fc68f094ffbd35cadf591e1834b9cfd35079dcf720bb50ca13c9eb60eb34ae&',
      'Image for Fall Spices',
      5
   );

/*==============================================================*/
/* Inserting data into Zutat table                              */
/*==============================================================*/
INSERT INTO
   Zutat (I_ID, B_ID, Name, Beschreibung)
VALUES
   (
      1,
      2,
      'Pumpkin Puree',
      'Puree made from fresh pumpkins'
   ),
   (2, 3, 'Coffee', 'Freshly brewed coffee'),
   (3, 4, 'Milk', 'Any kind of milk'),
   (
      4,
      5,
      'Fall Spices',
      'Cinnamon, Nutmeg, Ginger, and Cloves'
   );

/*==============================================================*/
/* Inserting data into Rezept table                             */
/*==============================================================*/
INSERT INTO
   Rezept (Name, Beschreibung, Rating, R_ID, B_ID)
VALUES
   (
      'Pumpkin Spice Latte',
      'A delicious homemade pumpkin spice latte',
      5,
      1,
      1
   );

/*==============================================================*/
/* Inserting data into Ingredient_Amount table                  */
/*==============================================================*/
INSERT INTO
   Ingredient_Amount (R_ID, I_ID, amount, unit)
VALUES
   (1, 1, 2, 'tablespoons'),
   (1, 2, 1, 'cup'),
   (1, 3, 2, 'cups'),
   (1, 4, 1, 'teaspoon');

/*==============================================================*/
/* Inserting data into Kategorie table                          */
/*==============================================================*/
INSERT INTO
   Kategorie (Name)
VALUES
   ('Beverages');

/*==============================================================*/
/* Inserting data into Kategorie_Rezept table                   */
/*==============================================================*/
INSERT INTO
   Kategorie_Rezept (Name, R_ID)
VALUES
   ('Beverages', 1);

/*==============================================================*/
/* Inserting data into RezeptStep table                         */
/*==============================================================*/
INSERT INTO
   RezeptStep (R_ID, RS_ID, Beschreibung)
VALUES
   (1, 1, 'Brew the coffee'),
   (1, 2, 'Heat the milk and pumpkin puree'),
   (
      1,
      3,
      'Mix the coffee, milk, pumpkin puree, and spices together'
   ),
   (1, 4, 'Serve with whipped cream on top');

/*==============================================================*/
/* Matcha                                                       */
/*==============================================================*/
INSERT INTO
   Bild (URI, Beschreibung, B_ID)
VALUES
   (
      'https://cdn.discordapp.com/attachments/1168685873903177840/1174282862766338148/matcha_latte_1_0.png?ex=65670723&is=65549223&hm=97562bd58b5e90d9145f49a32c23838b806b84dfeaa650183864d8bd2a23e4de&',
      'Image for Matcha Latte',
      6
   ),
   (
      'https://cdn.discordapp.com/attachments/1168685873903177840/1174282863391293450/JapaneseMatchaGreenTea6.png?ex=65670723&is=65549223&hm=9e856a9b789921b1373cabd60056b3136e7cab619ce72a72e025630adc2d8c51&',
      'Image for Matcha Powder',
      7
   ),
   (
      'https://cdn.discordapp.com/attachments/1168685873903177840/1174282863970111498/ImageForNews_753423_16891547829825380.png?ex=65670723&is=65549223&hm=51cdfbe7599f44d5267fde2ef2d1ed0cc730336b7d95ed70450a808830d433e1&',
      'Image for Matcha Sweetener',
      8
   );

/*==============================================================*/
/* Inserting data into Zutat table                              */
/*==============================================================*/
INSERT INTO
   Zutat (I_ID, B_ID, Name, Beschreibung)
VALUES
   (
      5,
      7,
      'Matcha Powder',
      'Powdered green tea leaves'
   ),
   (
      6,
      8,
      'Sweetener',
      'Sugar, honey, or any sweetener of choice'
   );

/*==============================================================*/
/* Inserting data into Rezept table                             */
/*==============================================================*/
INSERT INTO
   Rezept (Name, Beschreibung, Rating, R_ID, B_ID)
VALUES
   (
      'Matcha Latte',
      'A delicious and refreshing homemade matcha latte',
      5,
      2,
      6
   );

/*==============================================================*/
/* Inserting data into Ingredient_Amount table                  */
/*==============================================================*/
INSERT INTO
   Ingredient_Amount (R_ID, I_ID, amount, unit)
VALUES
   (2, 5, 1, 'tablespoon'),
   (2, 3, 1, 'cup'),
   (2, 6, 1, 'tablespoon');

/*==============================================================*/
/* Inserting data into Kategorie_Rezept table                   */
/*==============================================================*/
INSERT INTO
   Kategorie_Rezept (Name, R_ID)
VALUES
   ('Beverages', 2);

/*==============================================================*/
/* Inserting data into RezeptStep table                         */
/*==============================================================*/
INSERT INTO
   RezeptStep (R_ID, RS_ID, Beschreibung)
VALUES
   (2, 1, 'Add matcha powder to a cup'),
   (
      2,
      2,
      'Heat the milk and froth it until it gets steamy and frothy'
   ),
   (
      2,
      3,
      'Pour the frothed milk into the cup with matcha powder'
   ),
   (2, 4, 'Add sweetener to taste and stir well');

/* Inserting data into Bild table */
INSERT INTO
   Bild (URI, Beschreibung, B_ID)
VALUES
   (
      'https://cdn.discordapp.com/attachments/1168685873903177840/1174294269603872828/75581339.png?ex=656711c3&is=65549cc3&hm=3e62f89ffed789b0a34511e3a8a6bc4f414400695ccf9eb4668cee674514bdf8&',
      'Image for Chicken Fried Rice',
      9
   ),
   (
      'https://cdn.discordapp.com/attachments/1168685873903177840/1174292658554949713/Diced-Sliced-Cubed-Chicken-for-Recipes-featured-1.png?ex=65671043&is=65549b43&hm=7d0793f302c9d814fb51b0a9b005afa6d568cd1a1f27594b6e43bd4450036619&',
      'Image for Chicken',
      10
   ),
   (
      'https://cdn.discordapp.com/attachments/1168685873903177840/1174283807285854258/Perfect-White-Rice-Recipe-Redo-17-2.png?ex=65670804&is=65549304&hm=3ee50969c96882c5d0c0e788abb353d29d7e9d00a08a8e93a2a04b80642d3f18&',
      'Image for Rice',
      11
   ),
   (
      'https://cdn.discordapp.com/attachments/1168685873903177840/1174283807726243862/eggs-182316-1.png?ex=65670804&is=65549304&hm=aff2ce8fce14403ef68112a94e4a0cafa036c15a0298e0a561b1fb5d992a0274&',
      'Image for Egg',
      12
   );

/* Inserting data into Zutat table */
INSERT INTO
   Zutat (I_ID, B_ID, Name, Beschreibung)
VALUES
   (8, 10, 'Chicken', 'Diced cooked chicken'),
   (9, 11, 'Rice', 'Cooked rice'),
   (10, 12, 'Eggs', 'Beaten eggs');

/* Inserting data into Rezept table */
INSERT INTO
   Rezept (Name, Beschreibung, Rating, R_ID, B_ID)
VALUES
   (
      'Chicken Fried Rice',
      'A classic fried rice dish with chicken',
      5,
      3,
      9
   );

/* Inserting data into Ingredient_Amount table */
INSERT INTO
   Ingredient_Amount (R_ID, I_ID, amount, unit)
VALUES
   (3, 8, 1, 'cup'),
   (3, 9, 2, 'cups'),
   (3, 10, 2, 'eggs');

INSERT INTO
   Kategorie (NAME)
VALUES
   ('Rice');

INSERT INTO
   Kategorie_Rezept (Name, R_ID)
VALUES
   ('Rice', 3);

/* Inserting data into RezeptStep table */
INSERT INTO
   RezeptStep (R_ID, RS_ID, Beschreibung)
VALUES
   (3, 1, 'Stir fry chicken until no longer pink'),
   (
      3,
      2,
      'Push chicken to side of pan and add beaten eggs'
   ),
   (
      3,
      3,
      'Add rice and mix everything together until heated through'
   );