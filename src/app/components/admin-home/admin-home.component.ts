import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';
import { DataState } from 'src/app/objects/enum/data-state.enum';
import { AppResponse } from 'src/app/objects/interface/app-response';
import { AppState } from 'src/app/objects/interface/app-state';
import { Filter } from 'src/app/objects/interface/filter';
import { FilterService } from 'src/app/service/filter.service';
import { GenericService } from 'src/app/service/generic.service';

@Component({
  selector: 'admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
})
export class AdminHomeComponent implements OnInit {
  filtersState$: Observable<AppState<Filter[]>>;
  private initialResponse: AppResponse;
  readonly DataState = DataState;

  constructor(
    private filterService: FilterService,
    private genericService: GenericService
  ) {}

  ngOnInit(): void {
    this.getFilters();
  }

  search(event) {
    console.log(event.target.value);
    this.filtersState$ = this.filterFilters(
      event.target.value,
      this.initialResponse
    ).pipe(
      map((response) => {
        return {
          dataState: DataState.LOADED,
          appData: response.data.filters,
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

  private getFilters() {
    this.filtersState$ = this.genericService.$all('/v2/filter/all').pipe(
      map((response) => {
        this.initialResponse = response;
        return {
          dataState: DataState.LOADED,
          appData: response.data.filters,
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

  private filterFilters(filter: string, response: AppResponse) {
    return new Observable<AppResponse>((subscriber) => {
      subscriber.next(
        filter === ''
          ? { ...response, message: 'filtered' }
          : {
              ...response,
              //message: response.data.qresponses.filter(filterParameter => filterParameter[searchParameter] === filter).length > 0? 'Filtered by filter ${filter}':'Nothing Found',
              data: {
                // ...response.data,
                filters: response.data.filters.filter((f) => {
                  return (
                    String(f.enabled) === filter ||
                    Object.values(f.decodedFilter).find((a) => {
                      return Object.values(a)
                        .join('')
                        .toUpperCase()
                        .includes(filter.toUpperCase());
                    }) ||
                    f.questionnaireName.includes(filter)
                  );
                }),
              },
            }
      );
      subscriber.complete();
    }).pipe(tap(console.log), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    //console.log(error.error);
    return throwError('Error occured');
  }
}
