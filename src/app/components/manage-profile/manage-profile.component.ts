import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { GenericService } from 'src/app/service/generic.service';
import $ from 'jquery';
import { AppUser } from 'src/app/objects/interface/app-user';
import { catchError, map, startWith } from 'rxjs/operators';
import { DataState } from 'src/app/objects/enum/data-state.enum';
import { Observable, of } from 'rxjs';
import { AppState } from 'src/app/objects/interface/app-state';
import { AppResponse } from 'src/app/objects/interface/app-response';

@Component({
  selector: 'app-manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.css'],
})
export class ManageProfileComponent implements OnInit {

  public userState$:Observable<AppState<AppResponse>>
  public updateForm: FormGroup;
  public errorMessage:string;
  private user:AppUser;
  readonly DataState = DataState;
  
  constructor(
    private genericService: GenericService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {

    this.userState$ = this.getUserInfo();

    
  }

  onSubmit(){
    console.log({
      username:this.updateForm.value.username,
      oldPassword:this.updateForm.value.oldPassword,
      newPassword:this.updateForm.value.passwords.password,
      email:this.updateForm.value.email
    });
    
    this.genericService.$update({
      username:this.updateForm.value.username,
      oldPassword:this.updateForm.value.oldPassword,
      newPassword:this.updateForm.value.passwords.password,
      email:this.updateForm.value.email
    },'/v2/user/update/0')
    .subscribe(
      (resp)=>{
        console.log(resp);
        
      },
      (error)=>{
        console.log(error);
      }
    )
  }

  public showErrorDiv(){
    //document.getElementById("saved").style.display='block';
    $("#saved").fadeIn().css("display","inline-block");
  }


  private checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let pass = group.get('password').value;
    let confirmPass = group.get('passwordConfirm').value;

    return pass === confirmPass ? null : { notSame: true };
  };

  private setUpForm(){
    this.updateForm = this.fb.group({
      username: [this.user.username, [Validators.required]],
      email: [
        {value:this.user.email,disabled: true},
        [
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          Validators.required,
        ],
      ],

      oldPassword:['', [Validators.required]],

      passwords: this.fb.group(
        {
          password: ['', [Validators.required]],
          passwordConfirm: ['', [Validators.required]],
        },
        { validators: this.checkPasswords }
      ),
    });
  }

  private getUserInfo(){

    return this.genericService.$one(0,'/v2/user/','').pipe(
      map((response) => {
        this.user =response.data.user;
        this.setUpForm();
        return {
          dataState: DataState.LOADED,
          appData: response,
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
}
