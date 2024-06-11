import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { DBTaskService } from '../../services/dbtask.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  passwordInput!: string;
  userInput!: string;
  activeInput: boolean = false;

  constructor(
    private router: Router, 
    private dbtaskService: DBTaskService,
    private alertController: AlertController,
    private toastController: ToastController,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

    login_imp() {
      this.authService.login_exp(this.userInput, this.passwordInput);
    }

  async presentAlert(msj: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: msj,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentToast(msj: string | boolean) {
    const toast = await this.toastController.create({
      message: msj.toString(),
      duration: 2000,
      icon: 'globe'
    });
    await toast.present();
  }
}
