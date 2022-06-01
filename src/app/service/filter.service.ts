import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { config } from '../config/config';
import { Filter } from '../objects/interface/filter';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private http:HttpClient) { }

  filters$ = <Observable<Filter[]>>
  this.http.get<Filter[]>(config.apiUrl +'/filter/all')
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  filter$ =(filter:string,id:number) => <Observable<Filter>>
  this.http.get<Filter>(config.apiUrl +'/filter?filter='+filter+'&id='+id)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  public addFilter(filter:Filter):Observable<Filter>{
    return this.http.post<Filter>(config.apiUrl+'/filter/add',filter);
  }

  public updateFilter(filter:Filter):Observable<Filter>{
    return this.http.put<Filter>(config.apiUrl+'/filter/update',filter);
  }

  public switchEnabled(filter:string,value:number){
    return this.http.get<Filter>(config.apiUrl+'/filter/enable?filter='+filter+'&enabled='+value);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError('Error occured');
  }
}
