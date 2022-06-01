import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { of, Observable, throwError } from 'rxjs';
import { catchError, mapTo, take, tap } from 'rxjs/operators';
import { config } from '../config/config';
import { Tokens } from '../objects/model/token';
import { Role } from '../objects/model/role';
import { AppError } from '../objects/model/app_error';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private loggedUser!: string;
  public redirectUrl:string;
 

  constructor(private http: HttpClient) {}

  login(user: { username: string, password: string }): Observable<boolean> {
    console.log('attempting to login');
    const params = new HttpParams()
      .set('username',user.username)
      .set('password',user.password);

    return this.http.post<any>(`${config.apiUrl}/login`, params)
      .pipe(
        tap(tokens => this.doLoginUser(user.username, tokens)),
        mapTo(true));
  }

  logout() {
    this.doLogoutUser();
    return this.http.post<any>(`${config.apiUrl}/logout`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(
      tap(() => this.doLogoutUser()),
      mapTo(true),
      catchError(error => {
        alert(error.error);
        return of(false);
      }));
  }


  // isUser$ = <Observable<boolean>>
  // this.http.get<boolean>( config.apiUrl +'/is_user')
  // .pipe(
  //   tap(),
  //   catchError(this.handleError)
  // );

  // isAdmin$ = <Observable<boolean>>
  // this.http.get<boolean>( config.apiUrl +'/is_admin')
  // .pipe(
  //   tap(),
  //   catchError(this.handleError)
  // );

  hasRole$ =(role:string[])=><Observable<boolean>>
  this.http.get<boolean>( config.apiUrl +'/hasRole?roles='+role)
  .pipe(
    tap(),
    catchError(this.handleError)
  );

  roles$ = <Observable<string[]>>
  this.http.get<boolean>( config.apiUrl +'/roles')
  .pipe(
    tap(),
    catchError(this.handleError)
  );

  public getRoles():Observable<string[]>{
    return this.http.get<string[]>( config.apiUrl +'/roles');
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  refreshToken() {
    return this.http.post<any>(`${config.apiUrl}/refresh`, 
      this.getRefreshToken()
    ).pipe(tap((tokens: Tokens) => {
      this.storeJwtToken(tokens.access_token);
    }));
  }

  getJwtToken(){
    return localStorage.getItem(this.JWT_TOKEN) as string;
  }

  private doLoginUser(username: string, tokens: Tokens) {
      this.loggedUser = username;
      this.storeTokens(tokens);
  }

  private doLogoutUser() {
    this.loggedUser = '';
    this.removeTokens();
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeTokens(tokens: Tokens) {   
    localStorage.setItem(this.JWT_TOKEN, tokens.access_token);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refresh_token);
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    //console.log(error.error);
    return throwError('Error occured');
  }
}