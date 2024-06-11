import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DBTaskService } from '../services/dbtask.service';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private dbtaskService: DBTaskService,
    private alertController: AlertController
  ) { }


  register(user: string, password: string) {
    // Guardar los datos de sesión en la base de datos
    this.dbtaskService.insertarSesion(user, password, 0);
    this.login_exp(user, password);
  }

  async login_exp(userInput: string, passwordInput: string) {
    try {
      // Obtener las sesiones desde la base de datos
      const sesiones = await this.dbtaskService.buscarDatos('sesion');

      // Buscar el usuario ingresado en la tabla de sesiones
      const usuario = sesiones.find((sesion: any) => sesion.user_name === userInput);
      const claveUsuario: string = String(usuario.password);

      if (!usuario) {
        this.presentAlert('Usuario no encontrado');
        return;
      }

      // Verificar la contraseña
      if (claveUsuario !== passwordInput) {
        this.presentAlert('Contraseña incorrecta');
        return;
      }

      // Guardar los datos de sesión en sessionStorage
      sessionStorage.setItem('user_name', usuario.user_name);
      sessionStorage.setItem('password', usuario.password.toString());
      sessionStorage.setItem('active', '1');

      // Actualizar el estado del usuario a activo en la base de datos
      await this.dbtaskService.modificarSesion(usuario.user_name, usuario.password, 1);

      // Navegar a la página Home
      this.router.navigate(['/home']);
    } catch (e) {
      this.presentAlert('Usuario o contraseña incorrectos');
    }
  }

  async isLoggedIn(): Promise<boolean> {

    const user = sessionStorage.getItem('user_name');

    if (!user) {
      return false;
    }

    // buscar en la BD si el usuario está activo
    const sesiones = this.dbtaskService.buscarDatos('sesion');
    const userIsActive = (await sesiones).find((sesion: any) => sesion.user_name === user);

    if (userIsActive && userIsActive.active === 1) {
      return true;
    } else { 
      return false; 
    }
  }

  logout() {

    // cambiar el estado del usuario a inactivo en la base de datos
    this.dbtaskService.modificarSesion(sessionStorage.getItem('user_name'), sessionStorage.getItem('password'), 0);

    // limpiar el sessionStorage
    sessionStorage.clear();

    // navegar a la página de login
    this.router.navigate(['/login']);
  }

  async presentAlert(msj: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: msj,
      buttons: ['OK']
    });
    await alert.present();
  }
}
