create table if not exists developers(
	"id" SERIAL primary key,
	"name" VARCHAR(50) not null,
	"email"  VARCHAR(50) unique not null
);

create type "OS" as ENUM(
	'Windows', 'Linux' , 'MacOS'
);


create table if not exists developer_infos(
	"id" SERIAL primary key,
	"developerSince" DATE not null,
	"preferredOS" "OS" not null,
	"developerId" INTEGER unique not null,
	FOREIGN key("developerId") references developers("id") on delete cascade
);




create table if not exists projects(
	"id"  SERIAL primary key,
	"name" VARCHAR(50)not null,
	"description" text,
	"estimatedTime" VARCHAR(20) not null,
	"repository" VARCHAR (120) not null,
	"startDate" DATE not null,
	"endDate" DATE,
	"developerId" INTEGER ,
	FOREIGN key("developerId") references developers("id") on delete set null
);

create table if not exists technologies(
	"id"  SERIAL primary key,
	"name" VARCHAR(30)not null
);

create table if not exists projects_technologies(
	"id" SERIAL primary key,
	"addedIn" DATE not null,
	"technologyId" INTEGER  not null,
	"projectId" INTEGER not null,
	FOREIGN KEY("technologyId") references technologies(id),
	FOREIGN KEY("projectId") references projects(id) 
);

INSERT INTO
    technologies ("name")
VALUES
    ('JavaScript'),
    ('Python'),
    ('React'),
    ('Express.js'),
    ('HTML'),
    ('CSS'),
    ('Django'),
    ('PostgreSQL'),
    ('MongoDB');