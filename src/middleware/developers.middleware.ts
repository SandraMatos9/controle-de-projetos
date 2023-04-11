import { NextFunction, Request, Response } from 'express'
import { QueryConfig, QueryResult } from 'pg'
import { client } from '../database'
import { TDevelopers } from '../interfaces/developers.interface'

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
        "message": "Developer not found."
    })

}
response.locals.developers=queryResult.rows[0]
return next()
}
export{idDeveloperExistsMiddleware}