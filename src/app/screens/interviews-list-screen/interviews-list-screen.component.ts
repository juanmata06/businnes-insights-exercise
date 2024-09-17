import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
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
  tableDataLoading: boolean = false;
  displayedColumns: string[] = [
    'first_name', 'last_name',
    'email', 'phone',
    'is_first_interview', 'date_time',
    'actions'
  ];
  dataSource = new MatTableDataSource<iInterview>([]);
  /**
   * -----------------------------------------------------------------------------------------------------------------------------
   * LYFECYCLE METHODS
   * -----------------------------------------------------------------------------------------------------------------------------
   */
  constructor(
    private _interviewService: InterviewService
  ) {
    this.loading = true;
    this.getInterviewsList();
  }

  ngOnInit(): void { }

  /**
  * ------------------------------------------------------------------------------------------------------------------------------
  * PRIVATE METHODS
  * ------------------------------------------------------------------------------------------------------------------------------
  */
  private getInterviewsList(): void {
    this._interviewService.getInterviewsList().subscribe({
      next: (response: iInterview[]) => {
        if (!response)
          return
        this.dataSource = new MatTableDataSource<iInterview>(response);
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
