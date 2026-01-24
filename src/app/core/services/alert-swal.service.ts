import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertSwalService {
  constructor() { }

  showSuccess(message: string, title: string = 'Succès!') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonText: 'OK',
      allowOutsideClick: false
    });
  }

  showError(message: string, title: string = 'Erreur!') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
      allowOutsideClick: false
    });
  }

  showWarning(message: string, title: string = 'Attention!') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      confirmButtonText: 'OK',
      allowOutsideClick: false
    });
  }

  showInfo(message: string, title: string = 'Information') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'info',
      confirmButtonText: 'OK',
      allowOutsideClick: false
    });
  }

  showLoading(title: string = 'Traitement en cours...') {
    return Swal.fire({
      title: title,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  closeLoading() {
    Swal.close();
  }
}
