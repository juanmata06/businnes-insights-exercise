import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, of, throwError } from "rxjs";
import { iInterview } from "../models/interview.interface";
import { v4 as uuidv4 } from 'uuid'

@Injectable({
  providedIn: "root"
})
export class InterviewService {

  constructor(private _http: HttpClient) { }

  getInterviewsList(): Observable<iInterview[]> {
    const currentInterviews = localStorage.getItem('currentInterviews');
    return currentInterviews ? of(JSON.parse(currentInterviews)) : this._http.get<iInterview>('assets/data/interviews-list.json');
  }

  getInterviewById(id: string): Observable<iInterview> {
    const currentInterviews = this.getInterviewsList();
    return currentInterviews.pipe(map((interviews: iInterview[]) => {
      const interview = interviews.find((interview: iInterview) => interview.id === id);
      if (!interview) {
        throw new Error(`Interview with id ${id} not found`);
      }      
      return interview;
    }));
  }

  postInterview(data: iInterview): Observable<iInterview> {
    data['id'] = uuidv4()
    return this.getInterviewsList().pipe(
      map((interviews: iInterview[]) => {
        interviews.push(data);
        localStorage.setItem('currentInterviews', JSON.stringify(interviews));
        return data;
      }),
      catchError((error) => {
        return throwError(() => new Error('Error saving new interview'));
      })
    );
  }

  updateInterview(data: iInterview): Observable<iInterview> {
    return this.getInterviewsList().pipe(
      map((interviews: iInterview[]) => {
        const index = interviews.findIndex((item: iInterview) => item.id === data.id);
        console.log(index);
        
        if (index >= 0) {
          interviews[index] = data;
          localStorage.setItem('currentInterviews', JSON.stringify(interviews));
          return data;
        } else {
          throw new Error();
        }
      }),
      catchError((error) => {
        return throwError(() => new Error('Error updating interview'));
      })
    );
  }
}
