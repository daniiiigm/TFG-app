import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Record } from '../models/record.model';


@Injectable({
  providedIn: 'root'
})
export class RecordService {

  private apiUrl = '/api/records';

  constructor(private http: HttpClient) { }

  getAllRecords(): Observable<Record[]> {
    return this.http.get<Record[]>(`${this.apiUrl}/all`);
  }

  checkIn(userId: number): Observable<Record> {
    return this.http.post<Record>(`${this.apiUrl}/check-in/${userId}`, {});
  }

  checkOut(userId: number): Observable<Record> {
    return this.http.patch<Record>(`${this.apiUrl}/check-out/${userId}`, {});
  }

  getAllRecordsByUser(userId: number): Observable<Record[]> {
    return this.http.get<Record[]>(`${this.apiUrl}/all-records/${userId}`);
  }

  updateRecord(id: number, recordDTO: { checkIn: Date, checkOut: Date | null }): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, recordDTO);
  }


}