export class QuestionnaireResponse{

    id:number;
    questionnaireId:number;
    userId:number;
    filter:string;
    name:string;
    decodedFilter?:Record<string,string>;
}