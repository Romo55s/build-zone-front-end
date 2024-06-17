import { Injectable } from '@angular/core';
import { ToastifyRemoteControl } from '@ng-vibe/toastify';
import { ToastTypeEnum, ToastPosition } from '@ng-vibe/toastify';

@Injectable({
  providedIn: 'root'
})
export class TostifyService {
  private toast: ToastifyRemoteControl = new ToastifyRemoteControl();

  showSuccess(message: string, title: string = 'Success') {
    this.toast.options = {
      text: message,
      title: title,
      autoCloseDuration: 3000,
      layoutType: ToastTypeEnum.SUCCESS,
      position: ToastPosition.TOP_RIGHT,
    };
    this.toast.openToast();
  }

  showError(message: string, title: string = 'Error') {
    this.toast.options = {
      text: message,
      title: title,
      autoCloseDuration: 3000,
      layoutType: ToastTypeEnum.DANGER,
      position: ToastPosition.TOP_RIGHT,
    };
    this.toast.openToast();
  }

  showInfo(message: string, title: string = 'Info') {
    this.toast.options = {
      text: message,
      title: title,
      autoCloseDuration: 3000,
      layoutType: ToastTypeEnum.INFO,
      position: ToastPosition.TOP_RIGHT,
    };
    this.toast.openToast();
  }

  showWarning(message: string, title: string = 'Warning') {
    this.toast.options = {
      text: message,
      title: title,
      autoCloseDuration: 3000,
      layoutType: ToastTypeEnum.WARNING,
      position: ToastPosition.TOP_RIGHT,
    };
    this.toast.openToast();
  }
}
