type TDevelopers={
    id: number
    name: string
    email: string
}

type TDevelopersInfo={
    id: number
    developerSince:number
    preferredOS:string
    developerId: number
}

type TDevelopersRequest= Omit<TDevelopers,"id">
type TDevelopersInfoRequest= Omit<TDevelopers,"id">

export{TDevelopers,TDevelopersRequest,TDevelopersInfo,TDevelopersInfoRequest}