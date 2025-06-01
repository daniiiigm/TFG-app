import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = '/api/documents';

  constructor(private http: HttpClient) {}

  uploadDocument(file: File, name: string, userId: number): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);

    return this.http.post<Document>(`${this.apiUrl}/upload/${userId}`, formData);
  }

  getAll(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/all`);
  }

  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  getDocumentById(id: number): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/${id}`);
  }

  getDocumentsByUser(userId: number): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/all-documents/${userId}`);
  }
}
