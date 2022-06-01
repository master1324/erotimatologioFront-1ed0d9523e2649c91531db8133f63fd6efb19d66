import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './auth/admin.guard';
import { AuthGuard } from './auth/auth.guard';
import { AuthenticatedGuard } from './auth/authenticated.guard';
import { CheckRoleGuard } from './auth/check-role-guard.guard';
import { UserGuard } from './auth/user.guard';
import { AddQuestionnaireComponent } from './components/add-questionnaire/add-questionnaire.component';
import { EditQuestionnaireComponent } from './components/edit-questionnaire/edit-questionnaire.component';
import { EmailConfirmComponent } from './components/email-confirm/email-confirm.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ManageProfileComponent } from './components/manage-profile/manage-profile.component';
import { QuestionnaireReactiveComponent } from './components/questionnaire-reactive/questionnaire-reactive.component';
import { QuestionnaireResultComponent } from './components/questionnaire-result/questionnaire-result.component';
import { QuestionnaireComponent } from './components/questionnaire/questionnaire.component';
import { RegisterComponent } from './components/register/register.component';
import { SeeResponsesComponent } from './components/see-responses/see-responses.component';
import { UserManagmentComponent } from './components/user-managment/user-managment.component';


const routes: Routes = [
  {path:'',component:HomeComponent,canActivate:[AuthenticatedGuard]},
  {path:'signup',component:RegisterComponent},
  {path:'confirm',component:EmailConfirmComponent},
  {path:'login',component:LoginComponent,canActivate:[AuthGuard]},
  {path:'home',component:HomeComponent,canActivate:[AuthenticatedGuard]},
  {path:'q',component:QuestionnaireComponent,canActivate:[AuthenticatedGuard]},
  {path:'quest',component:QuestionnaireReactiveComponent,canActivate:[AuthenticatedGuard,UserGuard]},
  {path:'responses',component:SeeResponsesComponent,canActivate:[AuthenticatedGuard,UserGuard]},
  {path:'addq',component:AddQuestionnaireComponent,canActivate:[AuthenticatedGuard,CheckRoleGuard]},
  {path:'qresult',component:QuestionnaireResultComponent,canActivate:[AuthenticatedGuard,CheckRoleGuard]},
  {path:'users',component:UserManagmentComponent,canActivate:[AuthenticatedGuard,AdminGuard]},
  {path:'profile',component:ManageProfileComponent,canActivate:[AuthenticatedGuard]},
  {path:'qedit',component:EditQuestionnaireComponent,canActivate:[AuthenticatedGuard,AdminGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
