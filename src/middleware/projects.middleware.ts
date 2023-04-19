import { NextFunction, Request, Response } from 'express'
import { QueryConfig, QueryResult } from 'pg'
import { client } from '../database'
import { TDevelopers } from '../interfaces/developers.interfaces'

const nameTechnologieExistsMiddleware= async(
    request: Request,
    response: Response,
    next: NextFunction
):Promise <Response|void> =>{
    const name:string = request.body.name
    const queryString: string = `
    SELECT
        *
    FROM
        technologies
    WHERE
        name = $1;
`
const queryConfig:QueryConfig ={
    text: queryString,
    values:[name],
}

const  queryResult:QueryResult<TDevelopers> = await client.query(queryConfig)

if(queryResult.rowCount==0){
    return response.status(400).json({
        "message": "Technology not supported.",
        "options": [
          "JavaScript",
          "Python",
          "React",
          "Express.js",
          "HTML",
          "CSS",
          "Django",
          "PostgreSQL",
          "MongoDB"
        ]
      })

}
response.locals.technologiesId=queryResult.rows[0].id


return next()
}

const nameParamsTechnologieExistsMiddleware= async(
    request: Request,
    response: Response,
    next: NextFunction
):Promise <Response|void> =>{
    const name:string = request.params.name
    const projectId: number = parseInt(request.params.id);
    const technologyId = response.locals.technologiesId;
    const queryString: string = `
    SELECT
        *
    FROM
        technologies
    WHERE
        name = $1;
`
const queryStringNameTechExist = await client.query(`
    SELECT
        *
    FROM
    projects_technologies
    WHERE
    (  projects_technologies."projectId" = $1 AND  projects_technologies."technologyId" = $2 );
`, [projectId,technologyId])




if (queryStringNameTechExist.rowCount > 0) {
return response.status(400).json({
message: "Technologie already exists in this project",
});
}


const queryConfig:QueryConfig ={
    text: queryString,
    values:[name],
}

const  queryResult:QueryResult<TDevelopers> = await client.query(queryConfig)

if(queryResult.rowCount===0){
    return response.status(400).json({
        "message": "Technology not supported.",
        "options": [
          "JavaScript",
          "Python",
          "React",
          "Express.js",
          "HTML",
          "CSS",
          "Django",
          "PostgreSQL",
          "MongoDB"
        ]
      })

}
response.locals.technologiesId=queryResult.rows[0].id


return next()
}

const projectsExistsMiddleware= async(
    request: Request,
    response: Response,
    next: NextFunction
):Promise <Response|void> =>{
    const id:number = parseInt(request.params.id)
    const queryString: string = `
    SELECT
        *
    FROM
        projects
    WHERE
        id = $1;
`
const queryConfig:QueryConfig ={
    text: queryString,
    values:[id],
}

const queryResult:QueryResult<TDevelopers> = await client.query(queryConfig)

if(queryResult.rowCount===0){
    return response.status(404).json({
    message: "Project not found.",}
    )

}

return next()
}

const idDeveloperProjectsExistsMiddleware= async(
    request: Request,
    response: Response,
    next: NextFunction
):Promise <Response|void> =>{
    const id = request.body.developerId
    console.log(id)
    const queryString: string = `
    SELECT
        *
    FROM
        developers
    WHERE
        id = $1;
`
const queryConfig:QueryConfig ={
    text: queryString,
    values:[id],
}

const  queryResult:QueryResult<TDevelopers> = await client.query(queryConfig)
if(queryResult.rowCount===0){
    return response.status(404).json({
        message: "Developer not found."
    })

}
// response.locals.developers=queryResult.rows[0]
return next()
}

const techAlreadyExists= async(
    request: Request,
    response: Response,
    next: NextFunction
):Promise <Response|void> =>{
    const projectId: number = parseInt(request.params.id);
const technologyId = response.locals.technologiesId;
    const techAlreadyExists= await client.query(`

    SELECT  * FROM
    projects_technologies
    WHERE
    (  projects_technologies."projectId" = $1 AND  projects_technologies."technologyId" = $2 );

 `,[projectId,technologyId]
 ) 
 if (techAlreadyExists.rowCount > 0) {
  return response.status(409).json({
    message: "Technologie already exists in this project",
  });
}




}
export{projectsExistsMiddleware,nameTechnologieExistsMiddleware,idDeveloperProjectsExistsMiddleware,nameParamsTechnologieExistsMiddleware,techAlreadyExists}