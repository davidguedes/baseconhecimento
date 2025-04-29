import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ChatResponse, Message, Setor } from '../models/message.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:5000/api'; // URL da API Python
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messagesSubject.asObservable();
  private setorSubject = new BehaviorSubject<Setor>({} as Setor);
  public setor$ = this.messagesSubject.asObservable();

  constructor(private http: HttpClient) {}
  
  private getHeaders(): HttpHeaders {
    // Aqui você deve incluir o token de autenticação quando implementá-lo
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${this.getToken()}`
    });
  }

  sendMessage(content: string, sector: string, sector_name: string): Observable<Message> {
    // Envia a mensagem para a API
    return this.http.post<ChatResponse>(
      `${this.apiUrl}/chat/message`,
      { message: content, sector, sector_name },
      { headers: this.getHeaders() }
    ).pipe(
      map((response) => {
        console.log('response: ', response);
        const botMessage: Message = {
          id: Date.now().toString(),
          content: response.content,
          sender: 'bot',
          timestamp: new Date(),
          sector: sector
        };
        return botMessage;
      })
    );
  }

  addMessage(message: Message) {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
  }

  clearMessages() {
    this.messagesSubject.next([]);
  }

  setSetor(name: string) {
    this.setorSubject.next({name});
  }

  clearSetor() {
    this.setorSubject.next({name: 'TI'});
  }
}
