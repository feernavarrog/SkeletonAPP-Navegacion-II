import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

import { Sesiones } from './sesiones';
import { Experiencias } from './experiencias';
import { Certificaciones } from './certificaciones';

@Injectable({
  providedIn: 'root'
})
export class DBTaskService {

  public database!: SQLiteObject;

  /**
   * Creacion de tablas en la base de datos
   */     

  // Tabla para las sesiones 
  tablaSesion: string = "CREATE TABLE IF NOT EXISTS sesion (user_name TEXT(8) PRIMARY KEY NOT NULL, password INTEGER NOT NULL, active INTEGER NOT NULL);";
  tablaExperienciaLaboral: string = "CREATE TABLE IF NOT EXISTS experiencia_laboral (empresa TEXT(50), inicio TEXT(50), trabaja_aqui TEXT(50), termino TEXT(50), cargo TEXT(50));";                                                
  tablaCertificacion: string = "CREATE TABLE IF NOT EXISTS certificacion (nombre TEXT(50), fecha TEXT(50), vence TEXT(50), vencimiento TEXT(50));";

  // Observable para la lista de sesiones
  listarSesion = new BehaviorSubject([]);
  listarExperiencia = new BehaviorSubject([]); 
  listarCertificacion = new BehaviorSubject([]);

  // Observable para saber si la base de datos está lista
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private sqlite: SQLite,
    private platform: Platform,
    private toast: ToastController,
    private alertController: AlertController,
  ) { 
    this.crearDB();
   } 

  crearDB() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'user.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.crearTablas();
        })
        .catch(e => {
          this.presentToast("Error DB: " + e);
        });
    });
  }

  async crearTablas() { 
    try {
      await this.database.executeSql(this.tablaSesion, []);
      await this.database.executeSql(this.tablaExperienciaLaboral, []);
      await this.database.executeSql(this.tablaCertificacion, []);

      this.buscarSesiones();
      this.buscarExperiencia();
      this.buscarCertificacion();                                        
      this.isDBReady.next(true);                       
    } catch (e) {                                                          
      this.presentToast("Error Tablas: " + e);                
    }
  }
  
 // Funcion para buscar datos en la base de datos de forma generica
 buscarDatos(tabla: string): Promise<any[]> {
  return this.database.executeSql(`SELECT * FROM ${tabla}`, []).then(res => {
    let items: any[] = [];
    if (res.rows.length > 0) {
      for (let i = 0; i < res.rows.length; i++) {
        items.push(res.rows.item(i));
      }
    }
    return items;
  });
}

  buscarSesiones() {
    return this.database.executeSql('SELECT * FROM sesion', []).then(res => {
      let items: Sesiones[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            user_name: res.rows.item(i).user_name,
            password: res.rows.item(i).password,
            active: res.rows.item(i).active
          });
        }
      }
      this.listarSesion.next(items as any);
    })
  }

  buscarExperiencia() {
    return this.database.executeSql('SELECT * FROM experiencia_laboral', []).then(res => {
      let items: Experiencias[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            empresa: res.rows.item(i).empresa,
            inicio: res.rows.item(i).inicio,
            trabaja_aqui: res.rows.item(i).trabaja_aqui,
            termino: res.rows.item(i).termino,
            cargo: res.rows.item(i).cargo
          });
        }
      }
      this.listarExperiencia.next(items as any);
      //this.presentAlert('buscarExperiencia: ' + JSON.stringify(items)); // bugalert
    })
  }

  buscarCertificacion() {
    return this.database.executeSql('SELECT * FROM certificacion', []).then(res => {
      let items: Certificaciones[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            nombre: res.rows.item(i).nombre,
            fecha: res.rows.item(i).fecha,
            vence: res.rows.item(i).vence,
            vencimiento: res.rows.item(i).vencimiento
          });
        }
      }
      this.listarCertificacion.next(items as any);
    })
  }

  dbState() {
    return this.isDBReady.asObservable();
  }

  fetchSesiones(): Observable<Sesiones[]> {
    return this.listarSesion.asObservable();
  }

  fetchExperiencia(): Observable<Experiencias[]> {
    return this.listarExperiencia.asObservable();
  }

  fetchCertificacion(): Observable<Certificaciones[]> {
    return this.listarCertificacion.asObservable();
  }
  
  insertarSesion(user_name: any, password: any, active: any) {
    let data = [user_name, password, active];
    return this.database.executeSql('INSERT INTO sesion (user_name, password, active) VALUES (?, ?, ?)', data).then(res => {
      this.buscarSesiones();
    });
  }

  modificarSesion(user_name: any, password: any, active: any) {
    let data = [password, active, user_name];
    return this.database.executeSql('UPDATE sesion SET password = ?, active = ? WHERE user_name = ?', data).then(data2 => {
      this.buscarSesiones();
    })
  }

  eliminarSesion(user_name: any) {
    return this.database.executeSql('DELETE FROM sesion WHERE user_name = ?', [user_name]).then(a => {
      this.buscarSesiones();
    });
  }

  insertarExperiencia(empresa: any, inicio: any, trabaja_aqui: any, termino: any, cargo: any) {
    let data = [empresa, inicio, trabaja_aqui, termino, cargo];
    return this.database.executeSql('INSERT INTO experiencia_laboral (empresa, inicio, trabaja_aqui, termino, cargo) VALUES (?, ?, ?, ?, ?)', data).then(res => {
      this.buscarExperiencia();
    });
    
  }

  modificarExperiencia(empresa: any, inicio: any, trabaja_aqui: any, termino: any, cargo: any) {
    let data = [inicio, trabaja_aqui, termino, cargo, empresa];
    return this.database.executeSql('UPDATE experiencia_laboral SET inicio = ?, trabaja_aqui = ?, termino = ?, cargo = ? WHERE empresa = ?', data).then(data2 => {
      this.buscarExperiencia();
    })
  }

  eliminarExperiencia(empresa: any) {
    return this.database.executeSql('DELETE FROM experiencia_laboral WHERE empresa = ?', [empresa]).then(a => {
      this.buscarExperiencia();
    });
  }

  insertarCertificacion(nombre: any, fecha: any, vence: any, vencimiento: any) {
    let data = [nombre, fecha, vence, vencimiento];
    return this.database.executeSql('INSERT INTO certificacion (nombre, fecha, vence, vencimiento) VALUES (?, ?, ?, ?)', data).then(res => {
      this.buscarCertificacion();
    });
  }

  modificarCertificacion(nombre: any, fecha: any, vence: any, vencimiento: any) {
    let data = [fecha, vence, vencimiento, nombre];
    return this.database.executeSql('UPDATE certificacion SET fecha = ?, vence = ?, vencimiento = ? WHERE nombre = ?', data).then(data2 => {
      this.buscarCertificacion();
    })
  }

  eliminarCertificacion(nombre: any) {
    return this.database.executeSql('DELETE FROM certificacion WHERE nombre = ?', [nombre]).then(a => {
      this.buscarCertificacion();
    });
  }

  async presentToast(msj: string) {
    const toast = await this.toast.create({
      message: msj,
      duration: 2000,
      icon: 'globe'
    });

    await toast.present();
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
