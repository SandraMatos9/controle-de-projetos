import { Request, Response } from "express";
import {
  TDevelopers,
  TDevelopersInfo,
  TDevelopersInfoRequest,
  TDevelopersRequest,
} from "../interfaces/developers.interfaces";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import { developer1 } from "../__tests__/mocks/developers.mock";

const createDeveloper = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const developersData: TDevelopersRequest = request.body;

  const queryString: string = format(
    `
        INSERT INTO
        developers(%I)
        VALUES
        (%L)
        RETURNING *;
    `,
    Object.keys(developersData),
    Object.values(developersData)
  );
  const queryResult: QueryResult<TDevelopers> = await client.query(queryString);
  return response.status(201).json(queryResult.rows[0]);
};

const createDeveloperInfo = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const infoDevelopersData: TDevelopersInfo = request.body;
  // infoDevelopersData.id=parseInt(request.params.id)
  const newObject = {
    ...infoDevelopersData,
    developerId: parseInt(request.params.id),
  };

  const osType = ["Windows", "Linux", "MacOS"];
  if (!osType.includes(infoDevelopersData.preferredOS)) {
    return response
      .status(400)
      .json({
        message: "Invalid OS option.",
        options: ["Windows", "Linux", "MacOS"],
      });
  }
  const queryString: string = format(
    `
        INSERT INTO
         developer_infos(%I)
        VALUES
         (%L)
        RETURNING *;
    `,
    Object.keys(newObject),
    Object.values(newObject)
  );
  const queryResult: QueryResult<TDevelopers> = await client.query(queryString);

  return response.status(201).json(queryResult.rows[0]);
};

const listAllDeveloperInfo = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = parseInt(request.params.id);
  const queryString: string = 
   
    `
      SELECT
        dev.id AS "developerId",
        dev."name" AS "developerName",
        dev."email" AS "developerEmail",
        di."developerSince" AS "developerInfoDeveloperSince",
        di."preferredOS" AS "developerInfoPreferredOS"
      FROM
        developers dev
      FULL JOIN
        developer_infos di ON  di."developerId" = dev."id"
    WHERE
        dev.id=$1;

    `
  ;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult<TDevelopers> = await client.query(queryConfig);
  return response.json(queryResult.rows[0]);
};

const updateDeveloper = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = parseInt(request.params.id);
  const developerInfoData: Partial<TDevelopersInfo> = request.body;

  if (developerInfoData.developerId) {
    delete developerInfoData.developerId;
  }

  const queryString: string = format(
    `
        UPDATE
            developers
        SET(%I) = ROW(%L)
        WHERE
            "id"= $1
        RETURNING *;
    `,
    Object.keys(developerInfoData),
    Object.values(developerInfoData), 
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult<TDevelopersInfo> = await client.query(
    queryConfig
  );
  return response.json(queryResult.rows[0]);
};

const deleteDeveloper = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { id: developerId } = request.params;
  const queryString: string = `
    DELETE FROM
        developers
    WHERE
        "id"=$1

    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [developerId],
  };
  await client.query(queryConfig);

  return response.status(204).send();
};

export {
  createDeveloper,
  createDeveloperInfo,
  listAllDeveloperInfo,
  updateDeveloper,
  deleteDeveloper,
};
