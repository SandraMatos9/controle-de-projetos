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

  const projectId: number = parseInt(request.params.id);
  const technologyId = response.locals.technologiesId;
  const queryStringTechExistis = await client.query(
    `

    SELECT
      * 
    FROM
    projects_technologies
    WHERE
    (  projects_technologies."projectId" = $1 AND  projects_technologies."technologyId" = $2 );

 `,
    [projectId, technologyId]
  );
  if (queryStringTechExistis.rowCount > 0) {
    return response.status(409).json({
      message: "Technologie already exists in this project",
    });
  }
  /////////////////////////////////////
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

  //////////////////////////////////////////////
  const queryString2: string = ` 
  SELECT
  tech."id" AS "technologyId" ,
  tech."name" AS "technologyName",      
  pro.id AS "projectId",
  pro."name"  AS "projectName",
  pro."description" AS "projectDescription",
  pro."estimatedTime" AS "projectEstimatedTime",
  pro."repository" AS "projectRepository",
  pro."startDate" AS "projectStartDate",
  pro."endDate" AS "projectEndDate",
  pro."developerId" AS "projectDeveloperId"
  
  FROM
    projects pro
 
    FULL JOIN
    projects_technologies protech ON protech."projectId"= pro."id"
    FULL JOIN
    technologies tech ON tech."id"= protech."technologyId"
  WHERE
    pro.id=$1;    

  `;
  const queryConfigSelect2: QueryConfig = {
    text: queryString2,
    values: [projectId],
  };

  const queryResult2: QueryResult = await client.query(queryConfigSelect2);

  return response.status(201).json(queryResult2.rows[0]);
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
        
        pro.id AS "projectId",
        pro."name"  AS "projectName",
        pro."description" AS "projectDescription",
        pro."estimatedTime" AS "projectEstimatedTime",
        pro."repository" AS "projectRepository",
        pro."startDate" AS "projectStartDate",
        pro."endDate" AS "projectEndDate",
        pro."developerId" AS "projectDeveloperId",
        tech."id" AS "technologyId" ,
        tech."name" AS "technologyName"
        
     
        FROM
          projects pro
        FULL JOIN
          technologies tech ON pro."id"= tech."id"
        WHERE
          pro.id=$1;    
    
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
  const idDeveloper = response.locals.developers;
  console.log(idDeveloper);

  if (updateProjectData.developerId) {
    delete updateProjectData.developerId;
  }

  const queryString: string = format(
    `
      UPDATE
        projects
      SET(%I)=ROW(%L)
      WHERE
        "id"=$1
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

const deleteProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id = request.params.id

  const queryString: string = `
    DELETE FROM
        projects
    WHERE
        id= $1;
    `
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  await client.query(queryConfig);

  return response.status(204).send();
};

const deletTechProject = async (
  request: Request,
  response: Response
): Promise<Response> => {

  // const { projectId } = request.params;
  const id = request.params.id
  const technologyId = response.locals.technologiesId;
  const queryString: string = `
    DELETE  FROM
        projects_technologies
    WHERE
        "projectId" =$1 AND "technologyId"=$2
        
      RETURNING *;
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id, technologyId],
  };

  const queryResult = await client.query(queryConfig);
  if (queryResult.rowCount === 0) {
    return response.status(400).json({
      message: "Technology not related to the project.",
    });
  }

  return response.status(204).send();
};
export {
  createNewProject,
  registerNewTechProject,
  listProjectId,
  updateProject,
  deletTechProject,
  deleteProject,
};
