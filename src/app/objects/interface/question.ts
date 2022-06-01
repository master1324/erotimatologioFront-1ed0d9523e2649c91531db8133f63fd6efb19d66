export interface Question{
    id:number;
    question:string;
    userResponse?:string;
    responseId?:number;
    result?:string;
    resultMap?:Record<string,number>
    responseType:string;
    eligibleResponses:string[];
}