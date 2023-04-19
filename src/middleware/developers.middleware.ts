import { NextFunction, Request, Response } from 'express'
import { QueryConfig, QueryResult } from 'pg'
import { client } from '../database'
import { TDevelopers } from '../interfaces/developers.interfaces'

const idDeveloperExistsMiddleware= async(
    request: Request,
    response: Response,
    next: NextFunction
):Promise <Response|void> =>{
    const id:number = parseInt(request.params.id)
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

const idBodyDeveloperExistsMiddleware= async(
    request: Request,
    response: Response,
    next: NextFunction
):Promise <Response|void> =>{
    const id:number = request.body.developerId
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
response.locals.developers=queryResult.rows[0]
return next()
}


const emailDeveloperExistsMiddleware= async(
    request: Request,
    response: Response,
    next: NextFunction
):Promise <Response|void> =>{
    const email:string = request.body.email
    const queryString: string = `
    SELECT
        *
    FROM
        developers
    WHERE
        "email" = $1;
`
const queryConfig:QueryConfig ={
    text: queryString,
    values:[email],
}

const  queryResult:QueryResult<TDevelopers> = await client.query(queryConfig)
if(queryResult.rowCount>0){
    return response.status(409).json({
    message: "Email already exists.",
       
    })

}
response.locals.developers=queryResult.rows[0]
return next()
}


const informationDeveloperExistMiddleware= async(
    request: Request,
    response: Response,
    next: NextFunction
):Promise <Response|void> =>{
    const developerId:string = request.params.id
    const queryString: string = `
    SELECT
        *
    FROM
    developer_infos
    WHERE
    "developerId" = $1;
`
const queryConfig:QueryConfig ={
    text: queryString,
    values:[developerId],
}

const  queryResult:QueryResult<TDevelopers> = await client.query(queryConfig)

if(queryResult.rowCount>0){
    return response.status(409).json({
    message: "Developer infos already exists.",
       
    })

}
response.locals.developers=queryResult.rows[0]
return next()
}

export{idDeveloperExistsMiddleware,emailDeveloperExistsMiddleware,idBodyDeveloperExistsMiddleware,informationDeveloperExistMiddleware}