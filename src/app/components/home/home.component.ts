import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

import { GenericService } from 'src/app/service/generic.service';
import { DataState } from '../../objects/enum/data-state.enum';
import { AppState } from '../../objects/interface/app-state';
import { Questionnaire } from '../../objects/interface/questionnaire';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  appState$: Observable<AppState<Questionnaire[]>>;
  readonly DataState = DataState;

  constructor(private genericService: GenericService) {}

  ngOnInit(): void {
    this.appState$ = this.genericService.$all('/v2/quest/all').pipe(
      map((response) => {
        return {
          dataState: DataState.LOADED,
          appData: response.data.questionnaires,
        };
      }),
      startWith({
        dataState: DataState.LOADING,
      }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR, error });
      })
    );
  }
}
