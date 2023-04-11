create table if not exists developers(
	"id" SERIAL primary key,
	"name" VARCHAR(50) not null,
	"email" VARCHAR(50) unique not null
);

create table if not exists developer_infos(
"id" SERIAL primary key,
"developerSince" date not null,
"developerId" INTEGER unique not null,
FOREIGN key("developerId") references developers("id")
);