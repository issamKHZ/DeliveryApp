import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { OpenImageDialogService } from './open-image-dialog.service';
import { SubscriptionManager } from '../../../utils/subscription-manager';
import { take } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-img',
  standalone: true,
  imports: [
    CommonModule,
    AvatarModule,
    TranslateModule
  ],
  templateUrl: './profile-img.component.html',
  styleUrl: './profile-img.component.scss'
})
export class ProfileImgComponent extends SubscriptionManager {

  @Input() img: string;
  @Input() defaultImg: string;
  @Input() canEdit: boolean;

  @Output() editMode = new EventEmitter<any>();

  constructor(private openImageService: OpenImageDialogService) {
    super();
  }

  onUpload() {
    if (!this.canEdit) {
      return;
    }
    if (this.img) {
      this.openImageService.openDialog(this.img, this.defaultImg)
      this.register(
        this.openImageService.ref.onClose.pipe(
          take(1)
        ).subscribe((result) => {
          if (result?.saved) {
            if (result.emptyImage) {
              this.img = null;
            } else {
              this.img = result.image;
            }            
            this.editMode.emit({
              editMode: true,
              img: this.img
            });
          } else if (result?.saved === false) {
          }
        })
      )
    } else {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.onchange = (event) => {
        const input = event.target as HTMLInputElement;
        if (input.files?.[0]) {
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            this.img = e.target?.result as string;
            this.editMode.emit({
              editMode: true,
              img: this.img
            });
          };
          reader.readAsDataURL(input.files[0]);
        }
      };
      fileInput.click();
    }
  }

}
