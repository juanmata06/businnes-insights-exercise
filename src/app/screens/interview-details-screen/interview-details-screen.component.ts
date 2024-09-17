import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ReplaySubject } from "rxjs";
import { iInterview } from "src/app/logic/models/interview.interface";
import { InterviewService } from "src/app/logic/services/interview.service";

@Component({
  selector: 'app-interview-details-screen',
  templateUrl: './interview-details-screen.component.html',
  styleUrls: ['./interview-details-screen.component.scss']
})
export class InterviewDetailsScreenComponent implements OnInit {

  /**
  * ------------------------------------------------------------------------------------------------------------------------------
  * General vars for component
  * ------------------------------------------------------------------------------------------------------------------------------
  */
  isCreatingNewinterview: boolean = true;
  loading: boolean = false;
  id: string = '';
  interviewDetails!: iInterview;
  form!: FormGroup;
  isFormSubmitted: boolean = false;
  isFirstInterview: boolean = true;
  technicalQuestionsNote!: number | undefined;
  technicalTestNote!: number | undefined;
  private _unsubscribeAll: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * -----------------------------------------------------------------------------------------------------------------------------
   * LYFECYCLE METHODS
   * -----------------------------------------------------------------------------------------------------------------------------
   */
  constructor(
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _interviewService: InterviewService
  ) {
    this.loading = true;
    this.id = this._route.snapshot.params["id"];
    if (this.id == '' || this._router.url.includes('interview/create')) {
      this.createForm();
      return;
    }
    this.isCreatingNewinterview = false;
    this.getInterviewDetails();

  }

  ngOnInit(): void { }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  /**
  * ------------------------------------------------------------------------------------------------------------------------------
  * PRIVATE METHODS
  * ------------------------------------------------------------------------------------------------------------------------------
  */
  private getInterviewDetails(): void {
    this._interviewService.getInterviewById(this.id).subscribe({
      next: (response: iInterview) => {
        this.interviewDetails = response;
        this.createForm();
      },
      error: (badRequest) => this.goBackToList()
    });
  }

  private createForm(): void {
    this.form = this._formBuilder.group({
      first_name: [this.interviewDetails?.first_name || '', [Validators.required, Validators.minLength(2)]],
      last_name: [this.interviewDetails?.last_name || '', [Validators.required, Validators.minLength(2)]],
      email: [this.interviewDetails?.email || '', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      phone: [this.interviewDetails?.phone || '', [Validators.pattern(/^\d{9}$/)]],
      physique_description: [this.interviewDetails?.physique_description || ''],
      aptitude_description: [this.interviewDetails?.aptitude_description || ''],
    });
    this.isFirstInterview = this.interviewDetails?.is_first_interview ?? true;
    this.technicalQuestionsNote = this.interviewDetails?.technical_questions_note || undefined;
    this.technicalTestNote = this.interviewDetails?.technical_test_note || undefined;
  }

  private createNewInterview(data: iInterview): void {
    this._interviewService.postInterview(data).subscribe({
      complete: () => this.goBackToList()
    });
  }

  private updateInterview(data: iInterview): void {
    this._interviewService.updateInterview(data).subscribe({
      complete: () => this.goBackToList()
    });
  }

  /**
  * ------------------------------------------------------------------------------------------------------------------------------
  * PRIVATE VALIDATIONS METHODS
  * ------------------------------------------------------------------------------------------------------------------------------
  */

  /**
  * ------------------------------------------------------------------------------------------------------------------------------
  * PUBLIC METHODS
  * ------------------------------------------------------------------------------------------------------------------------------
  */
  public goBackToList(): void {
    this._router.navigate(['/']);
  }

  public saveOrEdit(): void {
    this.isFormSubmitted = true;

    if (this.form.invalid || this.isTechnicalQuestionsNoteNotValid()) {
      this.form.markAllAsTouched();
      return;
    }
    this.isFormSubmitted = false;
    let data: iInterview = this.form.value;
    data['is_first_interview'] = this.isFirstInterview;
    data['technical_questions_note'] = this.technicalQuestionsNote;
    data['technical_test_note'] = this.technicalQuestionsNote;
    if (!this.isCreatingNewinterview) data['id'] = this.id;

    if (this.isCreatingNewinterview)
      this.createNewInterview(data);
    else
      this.updateInterview(data);
  }

  /**
  * ------------------------------------------------------------------------------------------------------------------------------
  * PUBLIC VALIDATIONS METHODS
  * ------------------------------------------------------------------------------------------------------------------------------
  */
  public notValidField(controlName: string): boolean {
    return this.form.controls[controlName].invalid && (
      this.form.controls[controlName].dirty ||
      this.form.controls[controlName].touched
    );
  }

  public isTechnicalQuestionsNoteNotValid(): boolean {
    return (!this.isFirstInterview) && (this.isFormSubmitted) && isNaN(Number(this.technicalQuestionsNote));
  }
}
