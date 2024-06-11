import { Component, OnInit, ElementRef, ViewChild, } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AnimationController, AlertController } from '@ionic/angular';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { DBTaskService } from '../../services/dbtask.service';
import { Experiencias } from '../../services/experiencias';
import { Certificaciones } from '../../services/certificaciones';
import { HomePage } from '../../pages/home/home.page';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss'],
  animations: [
    trigger('fadeState', [
      state('void', style({
        opacity: 0
      })),
      transition(':enter', [
        animate(1500, style({
          opacity: 1
        }))
      ]),
    ]),
  ],
  providers: [DatePipe]
})
export class MisDatosComponent  implements OnInit {

  @ViewChild('nombreInput', { static: false, read: ElementRef }) nombreInput!: ElementRef;
  @ViewChild('apellidoInput', { static: false, read: ElementRef }) apellidoInput!: ElementRef;


    experiencias: Experiencias[] = [];
    certificaciones: Certificaciones[] = [];

    // Declaración de variables
    usuario         : string = '';
    nombre          : string = '';
    apellido        : string = '';
    nivelEducacion  : string = '';
    fechaNacimiento : Date | null = null; // Fecha de nacimiento
    showAdditionalInfo: boolean = false; 
    showDatePicker  : boolean = false; // Mostrar el date picker

    private animation: any;   // Animación de los inputs

    constructor(  // Inyección de dependencias
      private animationCtrl: AnimationController,
      private alertController: AlertController, 
      private route: ActivatedRoute,
      private dbtaskService: DBTaskService, 
      private router: Router,
      private datePipe: DatePipe,
      //private dataSharingService: DataSharingService,
      private homePage: HomePage
    ) {

    }

  ngOnInit() {
    this.dbtaskService.dbState().subscribe((ready) => {
      if (ready) {
        this.fetchData(); // Llama a la función para buscar datos cuando la base de datos esté lista
      }
    });
  }

  fetchData() {
    this.dbtaskService.fetchExperiencia().subscribe((experiencias) => {
      this.experiencias = experiencias;
    });

    this.dbtaskService.fetchCertificacion().subscribe((certificaciones) => {
      this.certificaciones = certificaciones;
    });
  }

  // animacion de los inputs (IONIC ANIMATION)
  ngAfterViewInit() {
    this.animation = this.animationCtrl
      .create()
      .addElement(this.nombreInput.nativeElement)
      .addElement(this.apellidoInput.nativeElement)
      .duration(1000) // 1 segundo
      .iterations(1) // 1 vez
      .fromTo('transform', 'translateX(0px)', 'translateX(100px)')
      .fromTo('opacity', '1', '0.2');
  }


    // Metodo para mostrar los datos ingresados


  presentAlert(message: string) {   // Método para mostrar una alerta
    this.alertController.create({
      header: 'Mensaje',
      message: message,
      buttons: ['OK']
    }).then(alert => alert.present());
  }

  // Método para mostrar/ocultar el date picker
  toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }


  editarCertificacion(nombre: any, fecha: any, vence: any, vencimiento: any) {
    // Crear un objeto con la nueva información del usuario
    const certInfo = { 

      nombre: nombre,
      fecha: fecha,
      vence: vence,
      vencimiento: vencimiento

    };
  
    // Redireccionar a la página home con los nuevos datos
    const navigationExtras: NavigationExtras = {
      state: {
        certInfo: certInfo
      }
    };
    this.homePage.changeSegment('certificaciones');
    this.router.navigate(['home/certificaciones'], navigationExtras);
  }

  eliminarCertificacion(nombre: any) {
    this.dbtaskService.eliminarCertificacion(nombre).then(() => {
    });
  }

  

  editarExperiencia(empresa: any, inicio: any, trabaja_aqui: any, termino: any, cargo: any) {
    // Crear un objeto con la nueva información del usuario
    const expInfo = { 

      empresa: empresa,
      inicio: inicio,
      trabaja_aqui: trabaja_aqui,
      termino: termino,
      cargo: cargo

    };
  
    // Redireccionar a la página home con los nuevos datos
    const navigationExtras: NavigationExtras = {
      state: {
        expInfo: expInfo
      }
    };
    this.homePage.changeSegment('experiencia-laboral');
    this.router.navigate(['home/experiencia-laboral'], navigationExtras);
  }

  eliminarExperiencia(empresa: any) {
    this.dbtaskService.eliminarExperiencia(empresa).then(() => {
      //this.fetchData();
    });
  }
}
