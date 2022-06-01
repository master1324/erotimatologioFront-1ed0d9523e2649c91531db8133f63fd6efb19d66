import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { DataState } from 'src/app/objects/enum/data-state.enum';
import { IdentifierType } from 'src/app/objects/enum/identifier-type.enum';
import { AppState } from 'src/app/objects/interface/app-state';
import { Questionnaire } from 'src/app/objects/interface/questionnaire';
import { FilterService } from 'src/app/service/filter.service';
import { GenericService } from 'src/app/service/generic.service';
import { IdentifierService } from 'src/app/service/identifier.service';


@Component({
  selector: 'app-questionnaire-identifiers',
  templateUrl: './questionnaire-identifiers.component.html',
  styleUrls: ['./questionnaire-identifiers.component.css'],
})
export class QuestionnaireIdentifiersComponent implements OnInit {
  public qIdentifierState$: Observable<AppState<Questionnaire>>;
  public decodedFilter$: Observable<AppState<Record<string,string>>>;
  public filter:string;
  public filterIsPresent:boolean;
  public questionnaireId:number;
  public link:string;
  private currentYear: number=new Date().getFullYear();
  readonly DataState = DataState;
  readonly IdentifierType = IdentifierType;
  public datetimelocal:string ;
  public enabled:boolean = true;
  private qName:string;

  

  @Output() newFilterEvent = new EventEmitter<string>();

  constructor(
    private identifierService: IdentifierService,
    private filterService:FilterService,
    private route: ActivatedRoute,
    private genericService:GenericService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.questionnaireId = params['id'];
      this.filter=params['filter'];
    });
    this.initiateIdentifiers(this.questionnaireId);

    if(this.filter!= undefined){
      this.filterIsPresent = true;
      this.decodeFilter(this.filter);
      this.link = location.origin +"/quest?id="+this.questionnaireId+"&filter="+ this.filter;
    }
  }


  public setFilter(form:NgForm){
    let values = Object.values(form.value);
    values.sort((n1,n2) =>{
      if (n1 > n2) {
        return 1;
    }

    if (n1 < n2) {
        return -1;
    }
    return 0;
    })
    this.filter =this.currentYear+","+values.join(",");
    this.createFilter(); 
  }

  public setFilterUser(form:NgForm){
    let values = Object.values(form.value);
    values.sort((n1,n2) =>{
      if (n1 > n2) {
        return 1;
    }

    if (n1 < n2) {
        return -1;
    }
    return 0;
    })
    this.filter =this.currentYear+","+values.join(",");
    console.log(this.filter);
    this.newFilterEvent.emit(this.filter);
  }

  public copyInputMessage(inputElement){
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }


  private initiateIdentifiers(id: number) {
    this.qIdentifierState$ = this.genericService.$one(id,'/v2/quest/','?filter=')
      .pipe(
        map((response) => {
          this.qName= response.data.questionnaire.name;
          return {
            dataState: DataState.LOADED,
            appData: response.data.questionnaire,
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

  private setEnabled(enabled:number){
    this.filterService.switchEnabled(this.filter, enabled)
    .subscribe(
      (response:any)=>{
        console.log('enabled changed');
      },
      (error:HttpErrorResponse)=>{
        console.log(error);
      }
    )
  }

  private createFilter(){

    this.genericService.$save(
      {
        activeFor:Date.parse(this.datetimelocal),
        questionnaireId:this.questionnaireId,
        filter:this.filter,
        enabled: this.enabled,
        questionnaireName:this.qName
      },
      '/v2/filter/add'
    ).subscribe(
      (response:any)=>{
        console.log(response);
        this.link = location.origin +"/quest?id="+this.questionnaireId+"&filter="+ this.filter;
        this.newFilterEvent.emit(this.filter);
      },
      (error:HttpErrorResponse)=>{
        console.log(error);
      }
    );

  }

  private decodeFilter(filter:string){
    this.decodedFilter$ = this.identifierService
      .decodedFilter$(filter)
      .pipe(
        map((response) => {
          
          return {
            dataState: DataState.LOADED,
            appData: response,
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

