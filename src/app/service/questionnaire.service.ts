import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { config } from '../config/config';
import { Identifier } from '../objects/interface/identifier';
import { Questionnaire } from '../objects/interface/questionnaire';


@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  

  constructor(private http:HttpClient) { }

  questionnairs$ = <Observable<Questionnaire>>
  this.http.get<Questionnaire>( config.apiUrl +'/quest/all')
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  questionnaire$ = (identifiers:Identifier) => <Observable<Questionnaire>>
  this.http.post<Questionnaire>( config.apiUrl +'/quest/all',identifiers)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  questionnaireIdentifiers$ = (id:number) =><Observable<Questionnaire>>
  this.http.get<Questionnaire>( config.apiUrl +'/quest/'+id+'?filter=')
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  questionnaireBody$ = (id:number,filter:string) =><Observable<Questionnaire>>
  this.http.get<Questionnaire>( config.apiUrl +'/quest/'+id+'?filter='+filter)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  questionnaireResult$ = (id:number,filter:string) =><Observable<Questionnaire>>
  this.http.get<Questionnaire>( config.apiUrl +'/quest/'+id+'/results?filter='+filter)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  save$ =(questionnaire:Questionnaire)=><Observable<Questionnaire>>
  this.http.post<Questionnaire>( config.apiUrl +'/quest/add',questionnaire)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  public saveQuestionnaire(questionnaire:Questionnaire):Observable<Questionnaire>{
    return this.http.post<Questionnaire>( config.apiUrl +'/quest/add',questionnaire);
  }

  public getQuerstionnaires():Observable<Questionnaire[]>{
    return this.http.get<Questionnaire[]>(config.apiUrl +'/quest/all');
  }

  public getQuerstionnaire(id:number,filter:string):Observable<Questionnaire>{
    return this.http.get<Questionnaire>(config.apiUrl +'/quest/'+id+'?filter='+filter);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(error.error.message);
  }

  

}
