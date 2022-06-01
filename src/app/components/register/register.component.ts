import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import $ from 'jquery';
import { GenericService } from 'src/app/service/generic.service';
import { RegisterService } from 'src/app/service/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  public errorMessage:string;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router,
    private genericService:GenericService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          Validators.required,
        ],
      ],

      passwords: this.fb.group(
        {
          password: ['', [Validators.required]],
          passwordConfirm: ['', [Validators.required]],
        },
        { validators: this.checkPasswords }
      ),
    });
  }

  onSubmit() {
      this.genericService.$save({
        username: this.registerForm.controls['username'].value,
        password: this.registerForm.get('passwords.password').value,
        email: this.registerForm.controls['email'].value,
        frontendLink: 'xd',
      },'/v2/user/add')
      .subscribe(
        (response: any) => {
          console.log(response); 
          this.router.navigate(['/login']);  
        },
        (error) => {
          console.log(error);
          this.errorMessage = error;
          this.showErrorDiv()
        }
      );
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
}
