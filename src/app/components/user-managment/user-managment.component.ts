import { Identifiers } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';
import { DataState } from 'src/app/objects/enum/data-state.enum';
import { AppResponse } from 'src/app/objects/interface/app-response';
import { AppState } from 'src/app/objects/interface/app-state';
import { Identifier } from 'src/app/objects/interface/identifier';
import { Teacher } from 'src/app/objects/interface/teacher';
import { GenericService } from 'src/app/service/generic.service';

@Component({
  selector: 'app-user-managment',
  templateUrl: './user-managment.component.html',
  styleUrls: ['./user-managment.component.css'],
})
export class UserManagmentComponent implements OnInit {
  public teachersState$: Observable<AppState<AppResponse>>;
  public teacherState$: Observable<AppState<AppResponse>>;
  public addTeacherForm: FormGroup;
  public updateTeacherForm: FormGroup;
  public selectedSubject: string;
  public selectedDepartment: string;
  public selectedSubject2: string;
  public selectedDepartment2: string;


  public subjectsArray: Identifier[] = [];
  public departmentsArray: Identifier[] = [];
  public identifiersSet: boolean = false;
  private identifiers: Identifier[] = [];
  private teacher:Teacher;
  private initialResponse:AppResponse;

  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  
  private currentAppResponse:AppResponse;
  readonly DataState = DataState;

  constructor(
    private genericService: GenericService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.setIdentifiers();
    //this.subjectsArray.push({id:0,name:'ANALISI 2',type:'69'})

    this.setTeachers();

    //TODO: to password tha to bazei to backend tixea kai tha to stelnei sto email tou kathigiti
    this.addTeacherForm = this.fb.group({
      name: [null, Validators.required],
      username: [null, Validators.required],
      email: [null, Validators.required],
      subjects: this.fb.array([]),
      departments: this.fb.array([]),
    });

    this.updateTeacherForm = this.fb.group({
      name: [null, Validators.required],
      subjects: this.fb.array([]),
      departments: this.fb.array([]),
    });
  }

  onAddTeacherSubmit() {
    this.isLoading.next(true);
    console.log(this.addTeacherForm.value);
    
    let listofindex = this.addTeacherForm.value.subjects;
    let listofindex2 = this.addTeacherForm.value.departments;
    this.addTeacherForm.value.subjects = this.subjectsArray.filter((a, b) =>
      listofindex.some((j) => b === j)
    );
    this.addTeacherForm.value.departments = this.departmentsArray.filter(
      (a, b) => listofindex2.some((j) => b === j)
    );

    this.genericService
      .$save(this.addTeacherForm.value, '/teacher/add')
      .subscribe(
        (response) => {
          this.isLoading.next(false);
          this.setTeachers();
        },
        (error) => {
          this.isLoading.next(false);
        }
      );
  }

  onUpdateTeacherSubmit(){
    this.isLoading.next(true);
    let listofindex = this.updateTeacherForm.value.subjects;
    let listofindex2 = this.updateTeacherForm.value.departments;
    this.updateTeacherForm.value.subjects = this.subjectsArray.filter((a, b) =>
      listofindex.some((j) => b === j)
    );
    this.updateTeacherForm.value.departments = this.departmentsArray.filter(
      (a, b) => listofindex2.some((j) => b === j)
    );

    console.log(this.updateTeacherForm.value);

    this.teacher.name = this.updateTeacherForm.value.name;
    this.teacher.subjects = this.updateTeacherForm.value.subjects;
    this.teacher.departments = this.updateTeacherForm.value.departments;

    this.genericService.$update(this.teacher,'/teacher/update/'+this.teacher.id)
    .subscribe(
      (response) => {
        this.isLoading.next(false);
        this.setTeachers();
      },
      (error) => {
        this.isLoading.next(false);
      }
    );
    
  }

  search(event) {
    console.log(event.target.value);
    this.teachersState$ = this.filterResponse(
      event.target.value,
      this.currentAppResponse
    ).pipe(
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
        console.log(error);
        return of({ dataState: DataState.ERROR, error });
      })
    );
  }

  deleteTeacher(id:number){
    if(confirm("Are you sure to delete ")) {
     this.genericService.$delete('/teacher/delete/'+id).subscribe(
      (response) => {
        this.setTeachers();
      },
      (error) => {
        
      }
     )
    }
  }

  filterServers(filter:string){
    //this.teachersState$ = this.genericService.$filter(filter,)
  }

  public loadTeacher(id:number){
    console.log(id);
    
    this.getTeacher(id);
  }

  public addSubects() {
    let exists = this.subjects().controls.find((control) => {
      return control.value == this.selectedSubject;
    });

    if (
      exists == undefined &&
      this.selectedSubject != undefined &&
      this.selectedSubject != '-1'
    ) {
      this.subjects().push(new FormControl(parseInt(this.selectedSubject)));
    } else {
      console.log('Subject Uparxei eidi');
    }
  }

  public addDepartments() {
    let exists = this.departments().controls.find((control) => {
      return control.value == this.selectedDepartment;
    });

    if (
      exists == undefined &&
      this.selectedDepartment != undefined &&
      this.selectedDepartment != '-1'
    ) {
      this.departments().push(
        new FormControl(parseInt(this.selectedDepartment))
      );
    } else {
      console.log('Department Uparxei eidi');
    }
  }

  public removeSubject(subjectIndex: number) {
    let index = this.subjects().controls.findIndex((control) => {
      return control.value == subjectIndex;
    });
    this.subjects().removeAt(index);
  }

  public removeDepartment(departmentIndex: number) {
    let index = this.departments().controls.findIndex((control) => {
      return control.value == departmentIndex;
    });
    this.departments().removeAt(index);
  }

  onSelectSubjectChange($event) {
    this.selectedSubject = (<HTMLInputElement>$event.target).value;
    console.log(this.selectedSubject);
  }

  onSelectDepartmentChange($event) {
    this.selectedDepartment = (<HTMLInputElement>$event.target).value;
    console.log(this.selectedDepartment);
  }

  subjects(): FormArray {
    return this.addTeacherForm.get('subjects') as FormArray;
  }

  departments(): FormArray {
    return this.addTeacherForm.get('departments') as FormArray;
  }


  //UPDATE

  public addSubects2() {
    let exists = this.subjects2().controls.find((control) => {
      return control.value == this.selectedSubject2;
    });
    console.log(exists);
    console.log(this.selectedSubject2);
    if (
      exists == undefined &&
      this.selectedSubject2 != undefined &&
      this.selectedSubject2 != '-1'
    ) {
      this.subjects2().push(new FormControl(parseInt(this.selectedSubject2)));
    } else {
      console.log('Subject Uparxei eidi');
    }
  }

  public addDepartments2() {
    let exists = this.departments2().controls.find((control) => {
      return control.value == this.selectedDepartment2;
    });
    console.log(exists);
    
    if (
      exists == undefined &&
      this.selectedDepartment2 != undefined &&
      this.selectedDepartment2 != '-1'
    ) {
      this.departments2().push(
        new FormControl(parseInt(this.selectedDepartment2))
      );
    } else {
      console.log('Department Uparxei eidi');
    }
  }

  public removeSubject2(subjectIndex: number) {
    let index = this.subjects2().controls.findIndex((control) => {
      return control.value == subjectIndex;
    });
    this.subjects2().removeAt(index);
    console.log(this.subjects2().value);
    
  }

  public removeDepartment2(departmentIndex: number) {
    let index = this.departments2().controls.findIndex((control) => {
      return control.value == departmentIndex;
    });
    this.departments2().removeAt(index);
    
    console.log(this.departments2().value);
    
  }

  onSelectSubjectChange2($event) {
    this.selectedSubject2 = (<HTMLInputElement>$event.target).value;
  }

  onSelectDepartmentChange2($event) {
    this.selectedDepartment2 = (<HTMLInputElement>$event.target).value;
    console.log(this.selectedDepartment2+"AAAAAAAAAAAAAAAAAAA");
  }

  subjects2(): FormArray {
    return this.updateTeacherForm.get('subjects') as FormArray;
  }

  departments2(): FormArray {
    return this.updateTeacherForm.get('departments') as FormArray;
  }

  private getTeacher(id: number) {
    this.teacherState$ = this.genericService.$one(id, '/teacher/','').pipe(
      map((response) => {
        
        this.teacher = response.data.teacher;
        this.updateTeacherForm.patchValue({name:this.teacher.name,subjects:this.teacher.subjects,departments:this.teacher.departments});
        this.populateForm();
        this.populateForm2();
        //this.updateTeacherForm.setValue({name:this.teacher.name,subjects:this.teacher.subjects,departments:this.teacher.departments});
   
        
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

  private populateForm(){
    this.subjects2().clear();
    this.teacher.subjects.forEach(subject =>{

      //console.log(this.subjectsArray.findIndex(s=> s.id == subject.id)+"XDDDD"); 
      this.subjects2().push(new FormControl(this.subjectsArray.findIndex(s=> s.id == subject.id)));
      //this.updateTeacherForm.controls.subjects = this.subjects2();
      console.log(this.subjects2().value);
    });
  }

  private populateForm2(){
    this.departments2().clear();
    this.teacher.departments.forEach(department =>{
      this.departments2().push(new FormControl(this.departmentsArray.findIndex(d=>d.id==department.id)));
    });
  }

  private setTeachers() {
    this.teachersState$ = this.genericService.$all('/teacher/all').pipe(
      map((response) => {
        this.currentAppResponse =response;
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

  private setIdentifiers() {
    this.genericService.$all('/identifier/all').subscribe(
      (response) => {

        this.identifiers = response.data.identifiers;


        this.subjectsArray = this.identifiers.filter(
          (ident) =>  ident.type === 'SUBJECT'
        );

        this.departmentsArray = this.identifiers.filter(
          (ident) => ident.type === 'DEPARTMENT'
        );

        this.identifiersSet = true;
      },
      (error) => {
        console.log(error);
      }
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
                teachers: response.data.teachers.filter(teacher => {

                  return teacher.name.includes(filter) ||
                  teacher.subjects.find(subject => subject.name.toUpperCase().includes(filter.toUpperCase())) ||
                  teacher.departments.find(department => department.name.toUpperCase().includes(filter.toUpperCase())) 
                  // return Object.values(teacher).find((a) => {
                  //   console.log(Object.values(a).join('')+"TEST");
                    
                  //   return Object.values(a).join('').toUpperCase().includes(filter.toUpperCase());
                  // });
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
