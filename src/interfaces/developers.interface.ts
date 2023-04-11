type TDevelopers={
    id: number
    name: string
    email: string
}

type TDevelopersInfo={
    id: number
    name: string
    email: string
}

type TDevelopersRequest= Omit<TDevelopers,"id">
type TDevelopersInfoRequest= Omit<TDevelopers,"id">

export{TDevelopers,TDevelopersRequest,TDevelopersInfo,TDevelopersInfoRequest}