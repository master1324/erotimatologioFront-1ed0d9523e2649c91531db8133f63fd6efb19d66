import { ApplicationRef, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { DataState } from 'src/app/objects/enum/data-state.enum';
import { AppState } from 'src/app/objects/interface/app-state';
import { Role } from 'src/app/objects/model/role';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {

  constructor(private authService: AuthService,router:Router,private appRef: ApplicationRef) {}

  ngOnInit(): void {
  }

  public isLoggedIn():boolean{
    return this.authService.isLoggedIn();
  }

  public logout():void {
    console.log('login out');
    this.authService.logout();
  }
 

}
