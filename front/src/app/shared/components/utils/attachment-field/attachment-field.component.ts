import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProfilEntrepCommonService } from '../../../services/profile/entreprise/pEntrepCommon.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-attachment-field',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule
  ],
  templateUrl: './attachment-field.component.html',
  styleUrl: './attachment-field.component.scss'
})
export class AttachmentFieldComponent {

  selectedFileName: string | null = null;

  @Input() fileUrl: string | ArrayBuffer | null;
  @Input() editMode: boolean;

  @Output() file = new EventEmitter<any>();

  constructor(private commonService: ProfilEntrepCommonService) {
    this.selectedFileName = this.commonService.extractFilenameFromUrl(this.fileUrl);
  }

  get fileIconClass() {
    if (!this.selectedFileName) return 'pi pi-file';
    if (this.selectedFileName.endsWith('.pdf')) return 'pi pi-file-pdf';
    if (/\.(jpg|jpeg|png)$/i.test(this.selectedFileName)) return 'pi pi-image';
    return 'pi pi-file';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const maxSizeInMB = 5;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      if (file.size > maxSizeInBytes) {
        alert('Le fichier dépasse la taille maximale de 5 Mo.');
        this.removeFile();
        return;
      }

      this.selectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.fileUrl = reader.result;        
        this.file.emit(this.fileUrl);
      };
      reader.readAsDataURL(file);
    }
  }


  previewFile(event: Event) {
    event.preventDefault();

    if (!this.selectedFileName || !this.fileUrl) {
      console.error('Aucun fichier à visualiser');
      return;
    }

    const blob = this.dataURLtoBlob(this.fileUrl as string);
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  }


  private dataURLtoBlob(dataURL: string): Blob {
    const parts = dataURL.split(',');
    const mime = parts[0].match(/:(.*?);/)?.[1];
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }


  removeFile() {
    this.selectedFileName = null;
    this.fileUrl = null;
    this.file.emit(this.fileUrl);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
