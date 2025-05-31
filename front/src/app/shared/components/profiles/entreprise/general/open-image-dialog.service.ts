import { Injectable, OnDestroy } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ChangeProfilPicComponent } from '../../../dialogs/change-profil-pic/change-profil-pic.component';
import { SubscriptionManager } from '../../../../utils/subscription-manager';

@Injectable({
    providedIn: 'root'
})
export class OpenImageDialogService extends SubscriptionManager implements OnDestroy {

    ref: DynamicDialogRef;
    currentImage: string;

    constructor(private dynamicDialog: DialogService) {
        super();
    }

    openDialog(image: string): void {
        this.ref = this.dynamicDialog.open(ChangeProfilPicComponent, {
            width: '25vw',
            closable: true,
            focusOnShow: false,
            modal: true,
            closeOnEscape: false,
            dismissableMask: false,
            data: {
                image: image                
            }
        });        
    }    

    ngOnDestroy(): void {
        this.clean();
    }

}
