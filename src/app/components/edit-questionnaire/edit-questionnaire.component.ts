import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { DataState } from 'src/app/objects/enum/data-state.enum';
import { ResponseType } from 'src/app/objects/enum/repsonse-type.enum';
import { AppResponse } from 'src/app/objects/interface/app-response';
import { AppState } from 'src/app/objects/interface/app-state';
import { Question } from 'src/app/objects/interface/question';
import { Questionnaire } from 'src/app/objects/interface/questionnaire';
import { QuestionGroup } from 'src/app/objects/interface/question_group';
import { GenericService } from 'src/app/service/generic.service';
import $ from 'jquery';

@Component({
  selector: 'app-edit-questionnaire',
  templateUrl: './edit-questionnaire.component.html',
  styleUrls: ['./edit-questionnaire.component.css'],
})
export class EditQuestionnaireComponent implements OnInit {
  public appState$: Observable<AppState<AppResponse>>;
  public questionnaireId: number;
  public questionnaireForm: FormGroup;
  readonly DataState=DataState;
  private questionnaire:Questionnaire;
  private responseType = ResponseType;
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  constructor(
    private genericService: GenericService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.questionnaireId = params['id'];
    });

    this.appState$ = this.getQuestionnaire();

    // this.questionnaireForm = this.fb.group({
    //   name: [null, Validators.required],
    //   shortDescription: [null, Validators.required],
    //   enabled:[null,Validators.required],
    //   //identifiers:this.fb.array([]),
    //   questionnaire: this.fb.array([this.newQuestionGroup()]),
    // });
  }

  onSubmit(){
    console.log(this.questionnaireForm.value);
    this.updateQuestionnaire(this.questionnaireForm.value);
  }

  onDeleteQuestionnaire(){
    if(confirm("Θέλετε να διαγράψετε οριστικά το ερωτηματολόγιο; Όλα τα δεδομένα σχετικά με αυτό θα διαγράφουν οριστικά")){
      this.deleteQuestionnaire();
      this.router.navigate(['/home']);
    }
  }

  public showSuccessDiv(message:string){
    //document.getElementById("saved").style.display='block';
    $("#saved").fadeIn().css("display","inline-block");
    document.getElementById("successMessage").innerHTML = message;
    $('#saved').delay(4000).fadeOut('slow');
  }

  public showErrorDiv(message:string){
    //document.getElementById("saved").style.display='block';
    $("#error").fadeIn().css("display","inline-block");
    document.getElementById("errorMessage").innerHTML = message;
    $('#error').delay(4000).fadeOut('slow');
  }

  public responseTypeValues():string[]{
    var values = Object.values(this.responseType);
    return values.slice();
  }

  public addQuestionGroup(){
    this.questionGroups().push(this.newQuestionGroup());
  }

  public removeQuestionGroup(index:number) {
    if(confirm("Διαγράφοντας την ομάδα ερωτήσεων θα διαγράψετε και όλες τις απαντήσεις που έχουν δοθεί στις ερωτήσεις της ομάδας. Θέλετε να συνεχίσετε;")) {
      this.questionGroups().removeAt(index);
    }
    
  }

  public addQuestion(index:number) {
    this.questions(index).push(this.newQuestion());
  }

  public removeQuestion(groupIndex:number,questionIndex:number) {
    if(confirm("Διαγράφοντας την ερώτηση θα διαγράψετε και όλες τις απαντήσεις που έχουν δοθεί σε αυτή. Θέλετε να συνεχίσετε;")) {
      this.questions(groupIndex).removeAt(questionIndex);
    }
    
  }

  private newQuestionGroup():FormGroup{
    return this.fb.group({
      id:[null],
      name:[null,Validators.required],
      responseType:[null,Validators.required],
      questions:this.fb.array([])
    })
  }

  private newQuestion():FormGroup{
    return this.fb.group({
      id:[null],
      question:[null,Validators.required]
    })
  }

  private setUpQuestionsArray(questions:Question[]){

    let formQuestions =[]

    questions.forEach(question =>{
      formQuestions.push(
        this.fb.group({
          id:[question.id,Validators.required],
          question:[question.question,Validators.required]
        })
      )
    });

    return formQuestions;
  }

  private setUpQuestionGroupsArray(groups:QuestionGroup[]){

    let formGroups = []

    groups.forEach(group =>{
      formGroups.push(
        this.fb.group({
          id:[group.id,Validators.required],
          name:[group.name,Validators.required],
          responseType:[group.responseType,Validators.required],
          questions:this.fb.array(this.setUpQuestionsArray(group.questions))
        })
      )
    });

    return formGroups;
  }

  private setUpForm(){   
    this.questionnaireForm = this.fb.group({
      id:[this.questionnaire.id, Validators.required],
      identifiers:[this.questionnaire.identifiers],
      name: [this.questionnaire.name, Validators.required],
      shortDescription: [this.questionnaire.shortDescription, Validators.required],
      enabled:[this.questionnaire.enabled],
      questionnaire: this.fb.array(this.setUpQuestionGroupsArray(this.questionnaire.questionnaire))
  })
  }

  private getQuestionnaire() {
    return this.genericService
      .$one(this.questionnaireId, '/v2/quest/', '?filter=info')
      .pipe(
        map((response) => {
          this.questionnaire = response.data.questionnaire
          console.log(this.questionnaire);
          
          this.setUpForm();
          return {
            dataState: DataState.LOADED,
            appData: response.data.questionnaire,
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

  private updateQuestionnaire(quest:Questionnaire){
    this.isLoading.next(true);
    this.genericService.$update(quest,'/v2/quest/update')
    .subscribe(
      resp =>{
        console.log(resp);
        this.showSuccessDiv("Οι αλλαγές αποθηκευτήκαν επιτυχώς")
        this.isLoading.next(false);
      },
      error =>{
        console.log(error);
        this.showErrorDiv("Σφάλμα κατά την αποθήκευση των αλλαγών")
        this.isLoading.next(false);
      }
    )
  }

  private deleteQuestionnaire(){
    this.genericService.$delete('/v2/quest/delete/'+this.questionnaireId)
    .subscribe(
      resp=>{
        console.log(resp);
      },
      error=>{
        console.log(error);
        this.showErrorDiv("Σφάλμα κατά την διαγραφή")
      }
    )
  }

  questions(index:number) : FormArray {
    return this.questionGroups().at(index).get("questions") as FormArray
  }

  questionGroups(): FormArray {
    return this.questionnaireForm.get("questionnaire") as FormArray
  }
}
