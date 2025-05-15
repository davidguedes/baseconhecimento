import { Component, inject, OnDestroy } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-document-mananger',
  imports: [
    TableModule,
    ButtonModule,
    FileUploadModule,
    ToastModule,
    ConfirmDialogModule,
    CardModule,
    ProgressSpinnerModule,
    TooltipModule,
    DatePipe
  ],
  templateUrl: './document-mananger.component.html',
  styleUrl: './document-mananger.component.scss',
  providers: [DocumentService, MessageService, ConfirmationService]
})
export class DocumentManangerComponent implements OnDestroy {
  unsubscribe$ = new Subject();
  user!: User;

  documents: Document[] = [];
  isLoading = false;
  errorMessage = '';

    protected userService: UserService = inject(UserService);
    protected documentService: DocumentService = inject(DocumentService);
    protected messageService: MessageService = inject(MessageService);
    protected confirmationService: ConfirmationService = inject(ConfirmationService);

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  ngOnInit() {
    this.user = this.userService.getUser() ?? {} as User;
    
    this.loadDocuments(this.user.sector.cod);
  }

  loadDocuments(sector: string) {
    this.isLoading = true;
    this.documentService.getDocuments(sector)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (docs) => {
        console.log('Os docs: ', docs);
        this.documents = docs;
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar documentos'
        });
        this.isLoading = false;
      }
    });
  }

  onUploads(event: any) {
    console.log("Vindo pra ca: ", event)
    const file = event.files[0];
    this.documentService.uploadDocument(file, this.user.sector.cod)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Documento enviado com sucesso'
        });
        this.loadDocuments(this.user.sector.cod);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao enviar documento'
        });
      }
    });
  }

  confirmDelete(filename: string) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o documento "${filename}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteDocument(this.user.sector.cod, filename)
    });
  }
  
  deleteDocument(sector: string, filename: string) {
    this.isLoading = true;
    this.documentService.deleteDocument(sector, filename)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Documento excluído com sucesso'
        });
        this.loadDocuments(this.user.sector.cod);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao excluir documento'
        });
        this.isLoading = false;
      }
    });
  }
}
