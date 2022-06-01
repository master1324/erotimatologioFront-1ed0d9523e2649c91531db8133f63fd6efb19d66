import { QuestionnaireResponse } from "./questionnaire-response";

export class Test{
    groupedResponses:Record<string,QuestionnaireResponse[]>;

    constructor(groupedResponses:Record<string,QuestionnaireResponse[]> ){
        this.groupedResponses = groupedResponses;
    }
}