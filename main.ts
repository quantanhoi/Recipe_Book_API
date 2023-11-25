import express from 'express';
import recipeRoutes from './routes/recipeAPI';
import ingredientRoutes from './routes/zutatAPI';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api/rezept', recipeRoutes);
app.use('/api/zutat', ingredientRoutes);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
