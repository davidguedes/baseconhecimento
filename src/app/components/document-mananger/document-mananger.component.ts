import { Component, OnDestroy } from '@angular/core';
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

  documents: Document[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private documentService: DocumentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    this.isLoading = true;
    this.documentService.getDocuments('ti')
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
    this.documentService.uploadDocument(file, 'ti')
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Documento enviado com sucesso'
        });
        this.loadDocuments();
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
      accept: () => this.deleteDocument('ti', filename)
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
        this.loadDocuments();
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
