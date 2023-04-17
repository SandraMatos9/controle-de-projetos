import { Request, Response } from "express";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import {
  TTechProject,
  TCreateTechProjectRequest,
  TProject,
  TProjectRequest,
} from "../interfaces/projects.interfaces";
import { developer1 } from "../__tests__/mocks/developers.mock";

const registerNewTechProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  //   const techProjectData: TTechProject = request.body;
  console.log("teste");
  const projectId: number = parseInt(request.params.id);
  console.log(projectId);
  const technologyId = response.locals.technologies;

  const queryString: string = ` 
    INSERT INTO
    projects_technologies("technologyId", "projectId", "addedIn")
    VALUES
    ($1,$2,$3)
    
    
    RETURNING *;
  
    `;
  const queryConfigSelect: QueryConfig = {
    text: queryString,
    values: [technologyId, projectId, new Date()],
  };

  const queryResult: QueryResult = await client.query(queryConfigSelect);

  if (queryResult.rowCount > 0) {
    return response.status(409).json({
      message: "Technologie already exists in this project",
    });
  }
  const queryStringInsert: string = `
    INSERT INTO 
      projects_technologies(%I)
    VALUES(%L)
    RETURNING*;
   
    `;

  const queryResultInsert: QueryResult = await client.query(queryStringInsert);

  return response.status(201).json(queryResultInsert.rows[0]);
};

const createNewProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const projectData: TProjectRequest = request.body;
  const queryString: string = format(
    `INSERT INTO
    projects(%I)
    VALUES
    (%L)
    RETURNING *;
    `,
    Object.keys(projectData),
    Object.values(projectData)
  );
  const queryResult: QueryResult<TProject> = await client.query(queryString);
  return response.status(201).json(queryResult.rows[0]);
};

const listProjectId = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const projectTechsList: TProject = request.body;
  const id = parseInt(request.params.id);

  const queryString: string = format(
    `
      SELECT
        di.id "developerId",
        dev.developerName": "Fabio",
        dev.developerEmail": "fabio.senior@kenzie.com.br",
        di.developerInfoDeveloperSince": "2013-01-01T02:00:00.000Z",
        di.developerInfoPreferredOS": "MacOS"

        pro.projectId
        pro.projectName
        pro.projectDescription
        pro.projectEstimatedTime
        pro.projectRepository
        pro.projectStartDate
        pro.projectEndDate
        pro.projectDeveloperId
         technologyId (esse dado pode ser nulo)
         technologyName (esse dado pode ser nulo)            
      FROM
        projects pro
    JOIN
        projects_technologies ptech ON pro."id"= ptech."projectId"
    LEFT JOIN
        technologies tech ON pro."id"= ptech."technologyId"
    WHERE
        pro.id=1$;    
    ;
    `
  );
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult<TProject> = await client.query(queryConfig);

  return response.json(queryResult.rows);
};

const updateProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = parseInt(request.params.id);
  const updateProjectData: Partial<TProjectRequest> = request.body;

  if (updateProjectData.developerId) {
    delete updateProjectData.developerId;
  }
  const queryString: string = format(
    `
  UPDATE
    projects
  SET(%I)=ROW(%L)
  WHERE
    "developerId"=$1
  RETURNING*;
  `,
    Object.keys(updateProjectData),
    Object.values(updateProjectData)
  );
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult<TProject> = await client.query(queryConfig);
  return response.json(queryResult.rows[0]);
};

const deleteProject = async (  request: Request,
  response: Response
): Promise<Response> => {
  const { developerId, technologyId } = request.params;

  const queryString: string = `
    DELETE  FROM
        projects
    WHERE
        "developerId" =$1;
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [developerId],
  };
  await client.query(queryConfig);

  return response.status(204).send();
}

const deletTechProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { developerId, technologyId } = request.params;

  const queryString: string = `
    DELETE  FROM
        projects_technologies
    WHERE
        "developerId" =$1 AND "technologyId"=$2;
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [developerId, technologyId],
  };
  await client.query(queryConfig);

  return response.status(204).send();
};
export {
  createNewProject,
  registerNewTechProject,
  listProjectId,
  updateProject,
  deletTechProject,
  deleteProject
};
