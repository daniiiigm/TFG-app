import { Component, OnInit } from '@angular/core';
import { DocumentService } from 'src/app/services/document.service';
import { AuthService } from 'src/app/services/auth.service';
import { Document } from 'src/app/models/document.model';
import { Router } from '@angular/router';
import { Record } from '../../models/record.model';
import { RecordService } from 'src/app/services/record.service';

@Component({
  selector: 'app-justificantes',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css'],
  standalone: false
})
export class DocumentsComponent implements OnInit {
    role: string | null = null;
    documents: Document[] = [];
    paginatedDocuments: Document[] = [];

    currentPage: number = 1;
    itemsPerPage: number = 13;
    totalPages: number = 0;
    pagesArray: number[] = [];

    userId: number | null = null;
    fichajeStatus: string = '';
    checkInDone: boolean = false;

    showUploadModal: boolean = false;
    uploadFile: File | null = null;
    uploadName: string = '';
    

    constructor( private documentService: DocumentService, private authService: AuthService, private router: Router, private recordService: RecordService) {}

    ngOnInit(): void {
        this.role = this.authService.getRole();
        this.userId = this.authService.getUserId();
        if (this.userId) {
            this.documentService.getDocumentsByUser(this.userId).subscribe((docs) => {
            this.documents = docs.sort((a, b) => new Date(b.loadDate).getTime() - new Date(a.loadDate).getTime());
            this.totalPages = Math.ceil(this.documents.length / this.itemsPerPage);
            this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
            this.updatePaginatedDocuments();
            });
        }
    }

    subirJustificante(): void {
        this.router.navigate(['/upload-document']);
    }

    abrirDocumento(docUrl: string): void {
        const url = `http://localhost:8080/${docUrl}`;
        window.open(url, '_blank');
    }

    fichar(): void {
    if (!this.userId) {
      this.fichajeStatus = 'Error: Usuario no identificado.';
      alert(this.fichajeStatus);
      return;
    }

    this.recordService.getAllRecordsByUser(this.userId).subscribe({
      next: (records) => {
        const today = new Date().toISOString().split('T')[0];

        const recordsToday = records.filter(r => {
          const checkInDate = new Date(r.checkIn).toISOString().split('T')[0];
          return checkInDate === today;
        });

        const ultimo = recordsToday[recordsToday.length - 1];

        if (!ultimo) {
          // No ha fichado hoy → Check-in
          this.recordService.checkIn(this.userId!).subscribe({
            next: () => {
            sessionStorage.setItem('checkInDone', 'true');
            this.checkInDone = true;
            this.fichajeStatus = 'Check-in registrado.';
            alert(this.fichajeStatus);
          },      
            error: () => {
              this.fichajeStatus = 'Error al hacer check-in.'
              alert(this.fichajeStatus);
            }
          });
        } else if (!ultimo.checkOut) {
          // Tiene check-in sin check-out → Check-out
          this.recordService.checkOut(this.userId!).subscribe({
            next: () => {
            sessionStorage.setItem('checkInDone', 'false');
            this.checkInDone = false;
            this.fichajeStatus = 'Check-out registrado.';
            alert(this.fichajeStatus);
          },
            error: () => {
              this.fichajeStatus = 'Error al hacer check-out.'
              alert(this.fichajeStatus);
            }
          });
        } else {
          // Ya tiene check-in y check-out
          this.fichajeStatus = 'Ya se ha fichado hoy.';
          alert(this.fichajeStatus);
        }
      },
      error: () => {
        this.fichajeStatus = 'No se pudo recuperar tu historial de fichajes.'
        alert(this.fichajeStatus);
      }
      
    });
  }

    logout(): void {
        sessionStorage.clear();
        this.authService.logout();
    }

    updatePaginatedDocuments(): void {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        this.paginatedDocuments = this.documents.slice(start, end);
    }

    changePage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.updatePaginatedDocuments();
        }
    }

    openUploadModal(): void {
        this.uploadFile = null;
        this.uploadName = '';
        this.showUploadModal = true;
    }

    closeUploadModal(): void {
        this.showUploadModal = false;
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input?.files && input.files.length > 0) {
            this.uploadFile = input.files[0];
        }
    }

    submitUpload(): void {
        if (this.uploadFile && this.uploadName.trim() && this.userId) {
            this.documentService.uploadDocument(this.uploadFile, this.uploadName, this.userId).subscribe({
            next: () => {
                this.closeUploadModal();
                this.ngOnInit(); // recarga la lista
            },
            error: err => console.error('Error al subir archivo', err)
            });
        }
    }
}
