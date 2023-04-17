type TProject = {
    name: string,
	description: string,
	estimatedTime:string,
	repository: string,
	startDate: number,
	developerId:number,

}

type TTechProject ={
    [x: string]: any
	id: number,
	name: string,
	description: string,
	estimatedTime: string,
	repository: string,
	startDate: number,
	endDate: number,
	developerId: number,
	technologyId:number,
	projectId:number
	
}

type TCreateTechProjectRequest= TTechProject &{
	developerId:number
}


type TProjectRequest = Omit <TProject,"id">


export{TProject,TProjectRequest,TTechProject,TCreateTechProjectRequest}