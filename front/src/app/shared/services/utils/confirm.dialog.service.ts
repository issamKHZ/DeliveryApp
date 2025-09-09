import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(
    private translate: TranslateService,
    private confirmationService: ConfirmationService
  ) { }

  showCloseConfirmation(
    key: string,
    message: string,
    isClosable: boolean,
    onAcceptCallback: (...args: any[]) => void = () => { },
    onRejectCallback: (...args: any[]) => void = () => { },
    acceptParams: any[] = [],
    rejectParams: any[] = []
  ): void {

    this.confirmationService.confirm({
      message: this.translate.instant(message),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        onAcceptCallback(...acceptParams);
      },
      reject: () => {
        onRejectCallback(...rejectParams);
      },
      acceptLabel: this.translate.instant('app.common.buttons-label.cancel'),
      rejectLabel: this.translate.instant('app.common.buttons-label.yes'),
      acceptButtonStyleClass: 'cold-button',
      rejectButtonStyleClass: 'p-button-danger',
      closable: isClosable,
      closeOnEscape: true,
      dismissableMask: true,
      key: key
    });
  }

  showSimpleConfirmation(
    key: string,
    message: string,
    isClosable: boolean,
    onAcceptCallback: () => void = () => { },
    onRejectCallback: () => void = () => { }
  ): void {
    this.showCloseConfirmation(
      key,
      message,
      isClosable,
      onAcceptCallback,
      onRejectCallback
    );
  }
}
