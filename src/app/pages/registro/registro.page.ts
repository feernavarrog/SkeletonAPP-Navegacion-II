import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  // Variables para el registro
  username!: string;
  password!: string;

  constructor(private toastController: ToastController,
              private authService: AuthService
  ) { }

  ngOnInit() {
  }

  validateUsername() {
    if (this.username.length < 5 || this.username.length > 10) {
      return false;
    }
    return true;
  }

  validatePassword() {
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,10}$/; // 8-10 caracteres, al menos una mayúscula y un número
    return regex.test(this.password);
  }


  register() {
    if (this.validateUsername() && this.validatePassword()) {
      this.presentToast('Registro exitoso');
      this.authService.register(this.username, this.password);
    } else {
      this.presentToast('Registro fallido');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
