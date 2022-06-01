import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public authService: AuthService, private router: Router) {}

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private urlsToSkip=["/login","/signup"]
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    

    if(this.urlsToSkip.includes(this.router.url)){
      console.log("INTERCEPTOR SKIP");
      return next.handle(request);
    }

    if (this.authService.getJwtToken()) {
                 
        request = this.addToken(request, this.authService.getJwtToken());
    }

    return next.handle(request).pipe(catchError(error => {
      
      
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        } 
        if (error instanceof HttpErrorResponse && error.status === 403) {
          
          this.handle403Error();
          return throwError(error);
        } else {
          return throwError(error);
        }
      
    }));

  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  private handle403Error(){
    let tokenHasExpired = this.tokenExpired(this.getRefreshToken());
    console.log(tokenHasExpired);
    
      if(tokenHasExpired){ //token has expired
        console.log('refresh token has expired logging out');   
        this.authService.logout()
        this.router.navigate(['/login']);
      }
      // }else{ //show forbiden 
      //   this.router.navigate(['/home']);
      // }
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      console.log('refreshing token');
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.access_token);
          return next.handle(this.addToken(request, token.access_token));
        }));

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(access_token => {
          return next.handle(this.addToken(request, access_token));
        }));
    }
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }
}
