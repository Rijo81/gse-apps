// estado.service.ts
import { Injectable } from '@angular/core';
import { AlertButton, AlertController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class QuickIonicService {

  constructor(private modalController: ModalController, private toastController: ToastController, private alertController: AlertController) {

  }

  async QuickModalController<T>(component: any, componentProps = {}, confirmMessage?: string, confirmCallbackFn?: (data: T) => Promise<void>, modalOptions: ModalOptions | any = {}, toastOptions: ToastOptions = {}) {

    const modal = await this.modalController.create({
      component: component,
      animated: true,
      canDismiss: true,
      componentProps: {
        ...componentProps
      },
      ...modalOptions,
    });
    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    if (role === 'confirm') {

      if (confirmMessage) {
        const toast = await this.toastController.create({
          message: confirmMessage,
          duration: 1500,
          position: 'top',
          ...toastOptions,

        });

        await toast.present();
      }
      if (confirmCallbackFn)
        await confirmCallbackFn(data)

      return data
    }
  }

  async QuickModalAlert(headerText: string, messageText: string, confirmHandler?: (value: any) => any, cancelHandler?: (value: any) => any, confirmText?: string, cancelText?: string, additionalButtons: (AlertButton | string)[] = []) {

    let buttons: (AlertButton | string)[] = additionalButtons

    buttons.push({
      text: confirmText ?? 'OK',
      role: 'confirm',
      handler: confirmHandler,
    })

    if (cancelText || cancelHandler) {
      buttons.push({
        text: cancelText ?? 'Cancelar',
        role: 'Cancel',
        handler: cancelHandler,
      })
    }


    const alert = await this.alertController.create({
      header: headerText,
      message: messageText,
      buttons: buttons,
    });

    await alert.present();
  }
}
