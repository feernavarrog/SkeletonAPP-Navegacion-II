import { Component, OnInit } from '@angular/core';
import { DBTaskService } from '../../services/dbtask.service';
import { AlertController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { HomePage } from '../../pages/home/home.page';


@Component({
  selector: 'app-certificaciones',
  templateUrl: './certificaciones.component.html',
  styleUrls: ['./certificaciones.component.scss'],
  providers: [DatePipe]
})
export class CertificacionesComponent  implements OnInit {

  userIsEditing: boolean = false;

  nombreInput: string = '';
  fecha: string = '';
  vence: string = '';
  vencimiento: string = '';

  tieneVencimiento: boolean = false;
  
  constructor(
    private dbtaskService: DBTaskService, 
    private alertController: AlertController,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    //private dataSharingService: DataSharingService,
    private homePage: HomePage
  ) { 
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {

        const certInfo = this.router.getCurrentNavigation()?.extras.state?.['certInfo'];

        if (certInfo) {
          this.nombreInput = certInfo.nombre;
          this.fecha = certInfo.fecha;
          this.vence = certInfo.vence;
          this.vencimiento = certInfo.vencimiento;
          this.userIsEditing = true;
        }
      }
    });
  }

  ngOnInit() {
  }

  onTieneVencimientoChange(event: any) {
    this.tieneVencimiento = event.detail.checked;
  }

  guardarCertificacion() {

    const vence: string = this.tieneVencimiento ? 'si' : 'no';
    const fechaFormateada = this.datePipe.transform(this.fecha, 'dd/MM/yyyy');

    let vencimiento = this.datePipe.transform(this.vencimiento, 'dd/MM/yyyy');

    if (!this.tieneVencimiento) {
      vencimiento = '';
    }

    this.dbtaskService.insertarCertificacion(this.nombreInput, fechaFormateada, vence, vencimiento).then(() => {
      this.nombreInput = '';
      this.fecha = '';
      this.tieneVencimiento = false;
      this.vencimiento = '';
    });

    this.homePage.changeSegment('mis-datos');
    this.router.navigate(['home/mis-datos']);

  }

  guardarCambioCertificacion() {

    const vence: string = this.tieneVencimiento ? 'si' : 'no';
    const fechaFormateada = this.datePipe.transform(this.fecha, 'dd/MM/yyyy');

    let vencimiento = this.datePipe.transform(this.vencimiento, 'dd/MM/yyyy');

    if (!this.tieneVencimiento) {
      vencimiento = '-';
    }

    this.dbtaskService.modificarCertificacion(this.nombreInput, fechaFormateada, vence, vencimiento).then(() => {
      this.nombreInput = '';
      this.fecha = '';
      this.tieneVencimiento = false;
      this.vencimiento = '';
    });

    this.userIsEditing = false;
    this.homePage.changeSegment('mis-datos');
    this.router.navigate(['home/mis-datos']);
  }

  descartarCambios() {
    this.userIsEditing = false;
    this.homePage.changeSegment('mis-datos');
    this.router.navigate(['home/mis-datos']);
  }

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }
}
