import { IdentifierType } from "../enum/identifier-type.enum";

export interface Filter {

    id?:number;
    activeFor:number;
    questionnaireId:number;
    filter:string;
    userId?:number;
    enabled:boolean;
    decodedFilter?:Record<string,string>;
    numOfResponses?:number;
    questionnaireName:string;

}
