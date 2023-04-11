import { Request, Response} from "express"
import { TDevelopers, TDevelopersInfo, TDevelopersRequest } from "../interfaces/developers.interface"
import format from "pg-format"
import { QueryResult } from "pg"
import { client } from "../database"


const createDeveloper = async(
    request: Request,
    response: Response
):Promise<Response> =>{

    const developersData:TDevelopersRequest = request.body
    const queryString:string = format(
        `
        INSERT INTO
        developers(%I)
        VALUES
        (%L)
        RETURNING *;
    `,
    Object.keys(developersData),
    Object.values(developersData)

    )
    const queryResult:QueryResult<TDevelopers> = await client.query(queryString)
    return response.status(201).json(queryResult.rows[0])
}

const createDeveloperInfo = async(
    request: Request,
    response: Response
):Promise<Response> =>{

    const infoDevelopersData:TDevelopersInfo = request.body
    infoDevelopersData.id=parseInt(request.params.id) 

    const queryString:string = format(
        `
        INSERT INTO
        developers(%I)
        VALUES
        (%L)
        RETURNING *;
    `,
    Object.keys(infoDevelopersData),
    Object.values(infoDevelopersData)

    )
    const queryResult:QueryResult<TDevelopers> = await client.query(queryString)

    
    return response.status(201).json(queryResult.rows[0]
)
}
export{createDeveloper,createDeveloperInfo}