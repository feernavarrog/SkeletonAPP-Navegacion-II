import { Component, OnInit } from '@angular/core';
import { DBTaskService } from '../../services/dbtask.service';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HomePage } from '../../pages/home/home.page';

@Component({
  selector: 'app-experiencia-laboral',
  templateUrl: './experiencia-laboral.component.html',
  styleUrls: ['./experiencia-laboral.component.scss'],
  providers: [DatePipe]
})
export class ExperienciaLaboralComponent  implements OnInit {

  trabajaActualmente: boolean = false;
  empresaInput: string = '';
  cargoInput: string = '';
  fechaInicioInput: string = '';
  fechaTerminoInput: string = '';

  userIsEditing: boolean = false;
  
  constructor(
    private dbtaskService: DBTaskService,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private homePage: HomePage
  ) { 
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {

        const expInfo = this.router.getCurrentNavigation()?.extras.state?.['expInfo'];

        if (expInfo) {
          this.empresaInput = expInfo.empresa;
          this.cargoInput = expInfo.cargo;
          this.fechaInicioInput = expInfo.inicio;
          this.fechaTerminoInput = expInfo.termino;
          this.userIsEditing = true;
        }

      }
    });
  }

  ngOnInit() {}

  onTrabajaActualmenteChange(event: any) {
    this.trabajaActualmente = event.detail.checked;
  }

  guardarExperiencia() {

    const trabaja: string = this.trabajaActualmente ? 'si' : 'no';
    const fechaInicioFormateada = this.datePipe.transform(this.fechaInicioInput, 'dd/MM/yyyy');
    
    let fechaTermino = this.datePipe.transform(this.fechaTerminoInput, 'dd/MM/yyyy');

    if (this.trabajaActualmente) {
      fechaTermino = '';
    }

    this.dbtaskService.insertarExperiencia(this.empresaInput, fechaInicioFormateada, trabaja, fechaTermino, this.cargoInput).then(() => {
      this.empresaInput = '';
      this.cargoInput = '';
      this.fechaInicioInput = '';
      this.fechaTerminoInput = '';
      this.trabajaActualmente = false;
    });

    this.homePage.changeSegment('mis-datos');
    this.router.navigate(['home/mis-datos']);
  }

  guardarCambios() {

    const trabaja: string = this.trabajaActualmente ? 'si' : 'no';
    let fechaTermino = this.datePipe.transform(this.fechaTerminoInput, 'dd/MM/yyyy');

    if (this.trabajaActualmente) {
      fechaTermino = '-';
    }

    const fechaInicioFormateada = this.datePipe.transform(this.fechaInicioInput, 'dd/MM/yyyy');

    this.dbtaskService.modificarExperiencia(this.empresaInput, fechaInicioFormateada, trabaja, fechaTermino, this.cargoInput).then(() => {
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
