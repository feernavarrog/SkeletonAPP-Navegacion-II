import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { MisDatosComponent } from 'src/app/components/mis-datos/mis-datos.component';
import { ExperienciaLaboralComponent } from 'src/app/components/experiencia-laboral/experiencia-laboral.component';
import { CertificacionesComponent } from 'src/app/components/certificaciones/certificaciones.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage,
    MisDatosComponent,
    ExperienciaLaboralComponent,
    CertificacionesComponent
  ]
})
export class HomePageModule {}
