import { Component, OnInit } from '@angular/core';
import { Observable, of, Subscriber } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';
import { DataState } from 'src/app/objects/enum/data-state.enum';
import { IdentifierType } from 'src/app/objects/enum/identifier-type.enum';
import { AppResponse } from 'src/app/objects/interface/app-response';
import { AppState } from 'src/app/objects/interface/app-state';
import { QuestionnaireResponse } from 'src/app/objects/interface/questionnaire-response';
import { GenericService } from 'src/app/service/generic.service';

@Component({
  selector: 'app-see-responses',
  templateUrl: './see-responses.component.html',
  styleUrls: ['./see-responses.component.css'],
})
export class SeeResponsesComponent implements OnInit {
  public qResponsesState$: Observable<
    AppState<Record<string, QuestionnaireResponse[]>>
  >;
  private response: QuestionnaireResponse[];
  private originalAppResponse: AppResponse;
  readonly DataState = DataState;
  readonly IdentifierType = IdentifierType;
  public group: string;

  constructor(private genericService: GenericService) {}

  ngOnInit(): void {
    this.initiateObservable();
  }

  groupByValue(value) {
    //this.groupBy(this.response,value);
    let obs = new Observable<QuestionnaireResponse[]>((subscriber) => {
      subscriber.next(this.response);
    });

    this.qResponsesState$ = obs.pipe(
      map((response) => {
        return {
          dataState: DataState.LOADED,
          appData: this.groupBy(response, value),
        };
      }),
      startWith({
        dataState: DataState.LOADING,
      }),
      catchError((error: string) => {
        console.log(error);
        return of({ dataState: DataState.ERROR, error });
      })
    );
  }

  search(event) {
    console.log(event.target.value);
    this.qResponsesState$ = this.filterResponse(
      event.target.value,
      this.originalAppResponse
    ).pipe(
      map((response) => {
        this.response = response.data.qresponses;
        return {
          dataState: DataState.LOADED,
          appData: this.groupBy(response.data.qresponses, 'YEAR'),
        };
      }),
      startWith({
        dataState: DataState.LOADING,
      }),
      catchError((error: string) => {
        console.log(error);
        return of({ dataState: DataState.ERROR, error });
      })
    );
  }

  public groupBy(
    questionnaireResponses: QuestionnaireResponse[],
    value
  ): Record<string, QuestionnaireResponse[]> {
    let keys = new Set<string>();
    let record: Record<string, QuestionnaireResponse[]> = {};

    questionnaireResponses.forEach((qResposne) => {
      let key = Object.entries(qResposne.decodedFilter).find((entry) => {
        return entry.includes(value);
      });
      if (key !== undefined) {
        keys.add(key[1]);
      } else {
        //keys.add('Υπόλοιπα');
      }
    });

    keys.forEach((key) => {
      if (key !== 'Υπόλοιπα') {
        let values: QuestionnaireResponse[];
        values = questionnaireResponses.filter((qResponse) => {
          return Object.entries(qResponse.decodedFilter).some((entry) => {
            return entry.includes(key);
          });
        });
        record[key] = values;
      } else if (key === 'Υπόλοιπα') {
        let values: QuestionnaireResponse[];
        values = questionnaireResponses.filter((qResponse) => {
          console.log(qResponse.name);
          return Object.entries(qResponse.decodedFilter).some((entry) => {
            return entry.includes(key);
          });
          // return Object.entries(qResponse.decodedFilter).some((entry) => {
          //   console.log(
          //     'entry: ' +
          //       entry[0] +
          //       ' value: ' +
          //       value +
          //       ' result:' +
          //       (entry[0] !== value)
          //   );
          //   entry[0] === value;
          // });
        });

        console.log(values + 'VALUES');
        record[key] = values;
      }
    });

    return record;
  }

  private initiateObservable() {
    this.qResponsesState$ = this.genericService.$all('/v2/response/all').pipe(
      map((response) => {
        this.originalAppResponse = response;
        this.response = response.data.qresponses;
        return {
          dataState: DataState.LOADED,
          appData: this.groupBy(response.data.qresponses, 'YEAR'),
        };
      }),
      startWith({
        dataState: DataState.LOADING,
      }),
      catchError((error: string) => {
        console.log(error);
        return of({ dataState: DataState.ERROR, error });
      })
    );
  }

  private filterResponse(filter: string, response: AppResponse) {
    return new Observable<AppResponse>((subscriber) => {
      console.log(response);
      subscriber.next(
        filter === ''
          ? { ...response, message: 'filtered' }
          : {
              ...response,
              //message: response.data.qresponses.filter(filterParameter => filterParameter[searchParameter] === filter).length > 0? 'Filtered by filter ${filter}':'Nothing Found',
              data: {
                ...response.data,
                qresponses: response.data.qresponses.filter((qresponse) => {
                  return Object.values(qresponse.decodedFilter).find((a) => {
                    return Object.values(a).join('').toUpperCase().includes(filter.toUpperCase());
                  });
                }),
              },
            }
      );
      subscriber.complete();
    }).pipe(
      tap(console.log)
      //catchError(this.handleError)
    );
  }
}
