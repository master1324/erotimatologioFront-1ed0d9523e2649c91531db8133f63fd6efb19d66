import { Question } from "./question";

export class QuestionGroup{
    id:number;
    name:string;
    responseType:string;
    questions?:Question[];
    eligibleResponses?:string[];
}