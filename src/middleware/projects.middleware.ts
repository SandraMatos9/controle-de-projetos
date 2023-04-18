import { NextFunction, Request, Response } from 'express'
import { QueryConfig, QueryResult } from 'pg'
import { client } from '../database'
import { TDevelopers } from '../interfaces/developers.interfaces'

const nameTechnologieExistsMiddleware= async(
    request: Request,
    response: Response,
    next: NextFunction
):Promise <Response|void> =>{
    const name:string = request.params.name
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
    return response.status(404).json({
        
        message: "Technology not found."
    })

}
response.locals.technologies=queryResult.rows[0].id


return next()
}

const technologieExistsMiddleware= async(
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

const  queryResult:QueryResult<TDevelopers> = await client.query(queryConfig)

if(queryResult.rowCount==0){
    return response.status(404).json({
    message: "TechProject not found",}
    )

}
response.locals.projects=queryResult.rows[0].id

return next()
}
export{technologieExistsMiddleware,nameTechnologieExistsMiddleware}