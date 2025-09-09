import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProfilEntrepCommonService } from '../../../services/profile/entreprise/pEntrepCommon.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { LargeContentFieldComponent } from "../large-content-field/large-content-field.component";

@Component({
  selector: 'app-attachment-field',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
    LargeContentFieldComponent
],
  templateUrl: './attachment-field.component.html',
  styleUrl: './attachment-field.component.scss'
})
export class AttachmentFieldComponent implements OnChanges {
  @Input() fileUrl: string | ArrayBuffer | null;
  @Input() editMode: boolean;
  @Output() file = new EventEmitter<any>();

  @Input() selectedFileName: string | null;
  processedFileUrl: string | ArrayBuffer | null = null;

  constructor(private commonService: ProfilEntrepCommonService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fileUrl']) {      
      this.handleFileUrlChange(changes['fileUrl'].currentValue);
    }
  }

  private handleFileUrlChange(newUrl: string | ArrayBuffer | null) {
    this.processedFileUrl = newUrl;
    
    if (newUrl) {
      if (typeof newUrl === 'string') {
        // Cas Data URL du backend
        if (!this.selectedFileName) {
          this.selectedFileName = this.extractFileNameFromDataUrl(newUrl);
        }
      } else {
        // Cas File/ArrayBuffer
        this.selectedFileName = 'document'; // Ou utilisez file.name si disponible
      }
    } else {
      this.selectedFileName = null;
    }
  }

  private extractFileNameFromDataUrl(dataUrl: string): string {
    try {
      const contentTypeMatch = dataUrl.match(/^data:(.*?);/);
      if (contentTypeMatch) {
        const contentType = contentTypeMatch[1];
        switch(contentType) {
          case 'application/pdf': return 'document.pdf';
          case 'application/msword': return 'document.doc';
          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': return 'document.docx';
          case 'image/jpeg': return 'image.jpg';
          case 'image/png': return 'image.png';
          default: return 'document';
        }
      }
      return 'document';
    } catch (e) {
      console.warn('Erreur extraction nom fichier', e);
      return 'document';
    }
  }

  get fileIconClass() {
    if (!this.selectedFileName) return 'pi pi-file';
    if (this.selectedFileName.endsWith('.pdf')) return 'pi pi-file-pdf';
    if (/\.(jpg|jpeg|png)$/i.test(this.selectedFileName)) return 'pi pi-image';
    if (/\.(doc|docx)$/i.test(this.selectedFileName)) return 'pi pi-file-word';
    return 'pi pi-file';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];

      // Validation taille
      if (file.size > 5 * 1024 * 1024) {
        alert('Fichier trop volumineux (>5Mo)');
        this.removeFile();
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.processedFileUrl = reader.result;
        this.selectedFileName = file.name;        
        this.file.emit({file: reader.result, name: file.name});
      };
      reader.readAsDataURL(file);
    }
  }

  previewFile(event: Event) {
    event.preventDefault();
    if (!this.processedFileUrl) return;

    const blob = this.dataURLtoBlob(this.processedFileUrl as string);
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  }

  private dataURLtoBlob(dataURL: string): Blob { 
    const parts = dataURL.split(',');
    const mime = parts[0].match(/:(.*?);/)?.[1];
    const bstr = atob(parts[1]);
    const u8arr = new Uint8Array(bstr.length);
    
    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    
    return new Blob([u8arr], { type: mime });
  }

  removeFile() {
    this.processedFileUrl = null;
    this.selectedFileName = null;
    this.file.emit(null);
    
    // Réinitialiser l'input file
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput && (fileInput.value = '');
  }
}