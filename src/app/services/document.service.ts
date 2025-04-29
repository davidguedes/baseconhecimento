import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Document } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://localhost:5000/api/documents';

  constructor(private http: HttpClient) {}

  uploadDocument(file: File, sector: string): Observable<any> {
    console.log('passando por aqui')
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sector', sector);
    return this.http.post(`${this.apiUrl}/upload-pdf`, formData);
  }

  getDocuments(sector: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/${sector}`);
  }

  deleteDocument(sector: string, filename: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${sector}/${filename}`);
  }
}
