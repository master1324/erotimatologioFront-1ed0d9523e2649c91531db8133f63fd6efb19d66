import { NumberValueAccessor } from "@angular/forms";
import { IdentifierType } from "../enum/identifier-type.enum";
import { Identifier } from "./identifier";

export interface Teacher{

    id:number;
    name:string;
    type:IdentifierType;
    subjects:Identifier[];
    departments:Identifier[];
    appUserId:number;

}