import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ReplaySubject } from "rxjs";
import { iInterview } from "src/app/logic/models/interview.interface";
import { InterviewService } from "src/app/logic/services/interview.service";

@Component({
  selector: 'app-interviews-list-screen',
  templateUrl: './interviews-list-screen.component.html',
  styleUrls: ['./interviews-list-screen.component.scss']
})
export class InterviewsListScreenComponent implements OnInit {

  /**
  * ------------------------------------------------------------------------------------------------------------------------------
  * General vars for component
  * ------------------------------------------------------------------------------------------------------------------------------
  */
  loading: boolean = false;
  private _unsubscribeAll: ReplaySubject<boolean> = new ReplaySubject(1);
  tableDataLoading: boolean = false;
  displayedColumns: string[] = [
    'first_name', 'last_name',
    'email', 'phone',
    'is_first_interview', 'date_time',
    'actions'
  ];
  dataSource = new MatTableDataSource<iInterview>([]);
  appliedFilter = '';

  /**
   * -----------------------------------------------------------------------------------------------------------------------------
   * LYFECYCLE METHODS
   * -----------------------------------------------------------------------------------------------------------------------------
   */
  constructor(
    private _interviewService: InterviewService
  ) {
    this.loading = true;
    this.appliedFilter = localStorage.getItem('currentAppliedFilter') || '';
    this.getInterviewsList();
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
  public getInterviewsList(): void {
    this.tableDataLoading = true;
    localStorage.setItem(`currentAppliedFilter`, this.appliedFilter);
    this.dataSource = new MatTableDataSource<iInterview>([]);
    this._interviewService.getInterviewsList().subscribe({
      next: (response: iInterview[]) => {
        if (!response)
          return
        this.dataSource = new MatTableDataSource<iInterview>(
          response.filter((interview: iInterview) => {
            if (this.appliedFilter === 'first') {
              return interview.is_first_interview === true;
            } else if (this.appliedFilter === 'second') {
              return interview.is_first_interview === false;
            }
            return true;
          })
        );
        this.tableDataLoading = false;
        localStorage.setItem(`currentInterviews`, JSON.stringify(response));
      }
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

  /**
  * ------------------------------------------------------------------------------------------------------------------------------
  * PUBLIC VALIDATIONS METHODS
  * ------------------------------------------------------------------------------------------------------------------------------
  */
}
