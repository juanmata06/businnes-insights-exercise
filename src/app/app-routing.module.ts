import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InterviewsListScreenComponent } from './screens/interviews-list-screen/interviews-list-screen.component';
import { InterviewDetailsScreenComponent } from './screens/interview-details-screen/interview-details-screen.component';

const routes: Routes = [
  { path: '', component: InterviewsListScreenComponent },
  { path: 'interview/create', component: InterviewDetailsScreenComponent },
  { path: 'interview/:id', component: InterviewDetailsScreenComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
