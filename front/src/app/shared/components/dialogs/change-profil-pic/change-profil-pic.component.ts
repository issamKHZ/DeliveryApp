import { CommonModule, NgIf } from '@angular/common';
import { Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { Message } from 'primeng/message';


@Component({
  selector: 'app-change-profil-pic',
  standalone: true,
  imports: [
    AvatarModule,
    ButtonModule,
    ConfirmDialogModule,
    TranslateModule,
    TooltipModule,
    Message,
    CommonModule
  ],
  templateUrl: './change-profil-pic.component.html',
  styleUrls: ['./change-profil-pic.component.scss'],
  providers: [ConfirmationService]
})
export class ChangeProfilPicComponent {

  
  readonly defaultImage = 'images/default-entreprise.png';
  image: string;
  emptyImage: boolean;
  hasChanges: boolean = false;
  showInfoMessage: boolean = false;

  @ViewChild('editorTemplate') editorTemplate!: TemplateRef<any>;
  @ViewChild('editorContainer', { read: ViewContainerRef }) editorContainer!: ViewContainerRef;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private confirmationService: ConfirmationService
  ) {
    this.image = this.config.data?.image;
    this.emptyImage = false;

    // Intercepter la méthode close originale
    const originalClose = this.ref.close.bind(this.ref);

    this.ref.close = (result?: any) => {
      if (this.hasChanges && !result?.forceClose) {
        this.showCloseConfirmation();
        return this.ref;
      }
      return originalClose(result);
    };
  }


  private showCloseConfirmation(): void {
    this.confirmationService.confirm({
      message: 'Voulez vous enregistrer les modifications ?',
      icon: 'pi pi-exclamation-triangle',
      closeOnEscape: false,
      dismissableMask: false,            
      key: 'closeConfirmation',
    });


  }

  handleDialogClose() {
    console.log('enter');

  }
  
  onAccept(): void {    
    this.ref.close({ saved: true, image: this.image, forceClose: true, emptyImage: this.emptyImage });
  }

  onReject(): void {      
    this.ref.close({ saved: false, forceClose: true });
  }
    

  // onCancel(): void {
  //   this.confirmationService.close();
  //   this.hideEditor = false;
  // }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.image = e.target?.result as string;
        this.hasChanges = true;
        this.emptyImage = false;
        this.displayMessageInfo();
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  editImage(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => this.onFileSelected(e);
    fileInput.click();
  }

  removeImage(): void {
    this.image = this.defaultImage;
    this.hasChanges = true;
    this.emptyImage = true;
    this.displayMessageInfo();
  }

  displayMessageInfo() {
    setTimeout(() => {
      this.showInfoMessage = true;

      setTimeout(() => {
        this.showInfoMessage = false;
      }, 2000);
    }, 200);
  }
}