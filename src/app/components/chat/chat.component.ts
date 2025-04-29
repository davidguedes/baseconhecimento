import { Component, inject, OnDestroy } from '@angular/core';
import { Message } from '../../models/message.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { CommonModule, DatePipe } from '@angular/common';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, ReactiveFormsModule, DatePipe, CardModule, InputTextModule, ButtonModule, ProgressSpinnerModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  providers: [ChatService]
})
export class ChatComponent implements OnDestroy {
  unsubscribe$ = new Subject();
  protected userService: UserService = inject(UserService);
  protected chatService: ChatService = inject(ChatService);
  protected fb: FormBuilder = inject(FormBuilder);
  
  messages: Message[] = [];
  chatForm!: FormGroup;
  isLoading: boolean = false;
  user: User = this.userService.getUser() ?? {} as User;

  ngOnInit() {
    this.chatForm = this.fb.group({
      message: ['', Validators.required]
    });
    
    this.chatService.messages$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(messages => {
      this.messages = messages;
      this.scrollToBottom();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  sendMessage() {
    if (this.chatForm.valid && !this.isLoading) {
      const content = this.chatForm.get('message')?.value;
      
      // Cria e adiciona mensagem do usuário
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: 'user',
        timestamp: new Date(),
        sector: this.user.sector.cod
      };
      
      this.chatService.addMessage(userMessage);
      this.chatForm.reset();
      this.alterLoading(true);
      
      // Envia mensagem para a API
      this.chatService.sendMessage(content, this.user.sector.cod, this.user.sector.name)
        .pipe(
          finalize(() => {
            this.alterLoading(false);
            this.scrollToBottom();
          })
        )
        .subscribe({
          next: (botMessage) => {
            this.chatService.addMessage(botMessage);
          },
          error: (error) => {
            console.error('Erro ao enviar mensagem:', error);
            // Adiciona mensagem de erro ao chat
            const errorMessage: Message = {
              id: Date.now().toString(),
              content: 'Desculpe, ocorreu um erro ao processar sua mensagem.',
              sender: 'bot',
              timestamp: new Date(),
              sector: this.user.sector.cod
            };
            this.chatService.addMessage(errorMessage);
          }
        });
    }
  }

  private scrollToBottom() {
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }

  private alterLoading(state: boolean): void {
    this.isLoading = state;

    if (this.isLoading) {
      this.chatForm.get('message')?.disable();
    } else {
      this.chatForm.get('message')?.enable();
    }
  }
}
