import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DataState } from 'src/app/objects/enum/data-state.enum';
import { IdentifierType } from 'src/app/objects/enum/identifier-type.enum';
import { ResponseType } from 'src/app/objects/enum/repsonse-type.enum';
import { AppState } from 'src/app/objects/interface/app-state';
import { Questionnaire } from 'src/app/objects/interface/questionnaire';
import { GenericService } from 'src/app/service/generic.service';


@Component({
  selector: 'app-add-questionnaire',
  templateUrl: './add-questionnaire.component.html',
  styleUrls: ['./add-questionnaire.component.css']
})
export class AddQuestionnaireComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private genericService:GenericService) { }

  public questionnaireForm: FormGroup;
  public identifierTypes = IdentifierType;
  public responseType = ResponseType;
  public selectedOption:string;
  appState$: Observable<AppState<Questionnaire[]>>;
  readonly dataState:DataState;
  readonly IdentifierType:IdentifierType;

  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  ngOnInit(): void {
    
    this.questionnaireForm = this.fb.group({

      name:[null,Validators.required],
      shortDescription:[null,Validators.required],
      identifiers:this.fb.array([]),
      questionnaire:this.fb.array([this.newQuestionGroup()])
      })
  }

  onSubmit() {
    this.isLoading.next(true);
    this.genericService.$save(this.questionnaireForm.value,'/v2/quest/add').subscribe(
      (response:any)=>{
        console.log(response);
        this.isLoading.next(false);
      },
      (error:HttpErrorResponse)=>{
        console.log(error);
        this.isLoading.next(false);
      }
    );
  }

  onSelectChange($event)
  {
   this.selectedOption = (<HTMLInputElement>$event.target).value;
   console.log(this.selectedOption);
   
  }

  public identifierValues():string[]{
    var values = Object.values(this.identifierTypes);
    return values.slice();
  }

  public responseTypeValues():string[]{
    var values = Object.values(this.responseType);
    return values.slice();
  }

  public identifierKeys():string[]{
    var keys = Object.keys(this.identifierTypes);
    return keys.slice();
  }

  public addIdentifier(){
    let exists = this.identifiers().controls.find(control =>{return control.value == this.selectedOption})
    
    if(exists == undefined && this.selectedOption !=undefined && this.selectedOption != '-1'){
      this.identifiers().push(new FormControl(parseInt(this.selectedOption)));
    }else{
      console.log("Uparxei eidi");
      
    }
  
  }

  public removeIdentifier(indentifier:number){
    let index = this.identifiers().controls.findIndex(control => { 
      return control.value == indentifier;
  });
  this.identifiers().removeAt(index);
  }

  public addQuestionGroup(){
    this.questionGroups().push(this.newQuestionGroup());
  }

  public removeQuestionGroup(index:number) {
    this.questionGroups().removeAt(index);
  }

  public addQuestion(index:number) {
    this.questions(index).push(this.newQuestion());
  }

  public removeQuestion(groupIndex:number,questionIndex:number) {
    this.questions(groupIndex).removeAt(questionIndex);
  }

  private newQuestionGroup():FormGroup{
    return this.fb.group({
      name:[null,Validators.required],
      responseType:[null,Validators.required],
      questions:this.fb.array([])
    })
  }

  private newQuestion():FormGroup{
    return this.fb.group({
      question:[null,Validators.required]
    })
  }

  identifiers(): FormArray {
    return this.questionnaireForm.get("identifiers") as FormArray
  }

  questions(index:number) : FormArray {
    return this.questionGroups().at(index).get("questions") as FormArray
  }

  questionGroups(): FormArray {
    return this.questionnaireForm.get("questionnaire") as FormArray
  }

}
