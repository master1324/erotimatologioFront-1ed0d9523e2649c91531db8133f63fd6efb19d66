import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { config } from '../config/config';
import { AppResponse } from '../objects/interface/app-response';

@Injectable({
  providedIn: 'root'
})
export class GenericService {

  constructor(private http:HttpClient) { }

  $all = (url:string) => <Observable<AppResponse>>
  this.http.get<AppResponse>(config.apiUrl+url).pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  $one =(id:number,url:string,params:string) => <Observable<AppResponse>>
  this.http.get<AppResponse>(config.apiUrl+url+id+params).pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  $save = (data:any,url:string)=><Observable<AppResponse>>
  this.http.post<any>(config.apiUrl+url, data).pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  $update = (data:any,url:string)=><Observable<AppResponse>>
  this.http.put<any>(config.apiUrl+url, data).pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  $delete = (url:string)=><Observable<AppResponse>>
  this.http.delete<any>(config.apiUrl+url).pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  $filter = (filter:string,response:AppResponse,parameter:string,searchParameter:string)=><Observable<AppResponse>>
  new Observable<AppResponse>(
    subscriber =>{
      console.log(response);
      subscriber.next(
        filter === '' ?{ ...response,message:'filtered'} :
        {
          ...response,
          message: response.data[parameter].filter(filterParameter => filterParameter[searchParameter] === filter).length > 0? 'Filtered by filter ${filter}':'Nothing Found',
          data:{
            ...response.data,      
            data: response.data[parameter].filter(filterParameter => filterParameter[searchParameter] === filter)
          }
        }
      );
      subscriber.complete();
    }
    ).pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(error.error.message);
  }
}
