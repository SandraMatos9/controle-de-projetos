import express, { Application } from "express";
import "dotenv/config";
import { startDatabase } from "./database";
import { createDeveloper, createDeveloperInfo, deleteDeveloper, listAllDeveloperInfo, updateDeveloper } from "./logics/developers.logic";
import { emailDeveloperExistsMiddleware, idDeveloperExistsMiddleware } from "./middleware/developers.middleware";
import { createNewProject, registerNewTechProject } from "./logics/projects.logic";
import { nameTechnologieExistsMiddleware, technologieExistsMiddleware } from "./middleware/projects.middleware";

const app: Application = express();
app.use(express.json())

//Cadastrar um novo desenvolvedor tabela Developers
app.post('/developers',emailDeveloperExistsMiddleware,createDeveloper)

//Cadastrar informações adicionais a um desenvolvedor tabela Developers
app.post('/developers/:id/infos',idDeveloperExistsMiddleware,createDeveloperInfo)

//Listar um desenvolvedor e seus projetos tabela Developers
app.get('/developers/:id',idDeveloperExistsMiddleware,listAllDeveloperInfo)

//Atualizar os dados de um desenvolvedor tabela Developers
app.patch('/developers/:id',idDeveloperExistsMiddleware,emailDeveloperExistsMiddleware, updateDeveloper)

//Remover um desenvolvedor tabela Developers
app.delete('/developers/:id',idDeveloperExistsMiddleware, deleteDeveloper)


///////////////////////////////////////////////////////////
//Cadastrar um novo projeto   
app.post('/projects',createNewProject)
//Listar um projeto pelo id  
app.post('/projects/:id/technologies',technologieExistsMiddleware,nameTechnologieExistsMiddleware,registerNewTechProject)
app.get('/projects/:id')
//Atualizar um projeto    
app.patch('/projects/:id')
//Excluir um projeto  
app.delete('/projects/:id/technologies')
//Deletar uma tecnologia de um projeto  
app.delete('/projects/:id/technologies/:name')


app.listen(3000, async() =>{
    await startDatabase()
    console.log('Server is running')
})

export default app;
