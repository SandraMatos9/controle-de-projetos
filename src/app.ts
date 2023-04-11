import express, { Application } from "express";
import "dotenv/config";
import { startDatabase } from "./database";
import { createDeveloper } from "./logics/developers.logic";

const app: Application = express();
app.use(express.json())
app.post('/developers',createDeveloper)
app.post('/developers/:id/infos')
app.get('/developers/:id')
app.patch('/developers/:id')
app.delete('/developers/:id')


app.listen(3000, async() =>{
    await startDatabase()
    console.log('Server is running')
})

export default app;
