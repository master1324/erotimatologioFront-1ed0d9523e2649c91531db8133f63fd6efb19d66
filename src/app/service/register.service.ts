import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { config } from '../config/config';
import { EmailToken } from '../objects/interface/email-token';
import { RegisterRequest } from '../objects/interface/register-request';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http:HttpClient) { }

  register$ =(request:RegisterRequest)=><Observable<string>>
  this.http.post<RegisterRequest>( config.apiUrl +'/register',request)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  public register(request:RegisterRequest):Observable<EmailToken>{
    return this.http.post<EmailToken>( config.apiUrl +'/signup',request,);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError('Error occured');
  }
}
