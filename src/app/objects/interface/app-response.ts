export interface AppResponse{

    timestamp:string;
    statusCode:number;
    status:string;
    reason?:string;
    message?:string;
    developerMessage?:string;
    data?:Record<any,any>
    affectedResources?:Record<any,any>
    
}