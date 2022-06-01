import { HttpErrorResponse } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm } from '@angular/forms';

import { Questionnaire } from 'src/app/objects/interface/questionnaire';
import { Question } from 'src/app/objects/interface/question';
import { QuestionGroup } from 'src/app/objects/interface/question_group';
import { Response } from 'src/app/objects/interface/response';
import { QuestionnaireService } from 'src/app/service/questionnaire.service';
import { ResponseService } from 'src/app/service/response.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AppState } from 'src/app/objects/interface/app-state';
import { DataState } from 'src/app/objects/enum/data-state.enum';
import { catchError, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css'],
})
export class QuestionnaireComponent implements OnInit {

  public questionnaire:Questionnaire = new Questionnaire;
  public questionnaireIdentifiers:Questionnaire = new Questionnaire;
  public hasSetIdentifiers:boolean = false;
  public filter:string;
  public questionnaireId:number;
  public models=[];
  public responses:Response[]=[];
  private currentYear: number=new Date().getFullYear();

  constructor(
    private questionnaireService: QuestionnaireService,
    private responseService:ResponseService,
    private route:ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.questionnaireId = params['id'];
    });

    this.getQuestionnaireIdentifiers(this.questionnaireId,'');
  }

  private getQuestionnaireIdentifiers(id:number,filter:string){
    this.questionnaireService.getQuerstionnaire(id,filter).subscribe(
      (response:Questionnaire)=>{
        this.questionnaireIdentifiers= response;
      },
      (error:HttpErrorResponse)=>{
        console.log(error);
      }
    )
  }

  public getQuestionnaireBody(id:number,filter:string){
    this.questionnaireService.getQuerstionnaire(id,filter).subscribe(
      (response:Questionnaire)=>{
        this.questionnaire= response;     
        this.responses = this.setResponses();
        console.log(this.responses);
      },
      (error:HttpErrorResponse)=>{
        console.log(error);
      }
    )
  }

  public getFilter(){     
    this.models.sort((n1,n2) =>{
      if (n1 > n2) {
        return 1;
    }

    if (n1 < n2) {
        return -1;
    }
    return 0;
    })
    let filter  = this.currentYear + this.models.join("");
    console.log(filter);
    this.hasSetIdentifiers = true;
    this.filter =filter;
    this.getQuestionnaireBody(this.questionnaireId,filter);
  }

  public save(){

    console.log(this.responses); 

    this.responseService.addResponses(this.responses).subscribe(
      (response:any)=>{
        console.log(response);
      },
      (error:HttpErrorResponse)=>{
        console.log(error);
      }
    );
  }

  private setResponses():Response[]{
    let responses:Response[]=[];
    
    this.questionnaire.questionnaire.forEach((group) =>{
      group.questions.forEach((question) =>{
        responses.push({
          id:question.responseId,
          question:question,
          response:question.userResponse,
          filter:this.filter
        });
      });
    });

    return responses;
  }

  private setIdentifiers(){

  }
}
