import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { config } from '../config/config';
import { QuestionnaireResponse } from '../objects/interface/questionnaire-response';
import { Response } from '../objects/interface/response';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {

  constructor(private http:HttpClient) { }




  public addResponses(responses:Response[]):Observable<Response[]>{
    return this.http.post<Response[]>(config.apiUrl+'/response/addAll',responses);
  }

  questionnaireResponses$ = <Observable<QuestionnaireResponse[]>>
  this.http.get<QuestionnaireResponse[]>( config.apiUrl +'/response/all_quest_responses')
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError('Error occured');
  }
  
}
