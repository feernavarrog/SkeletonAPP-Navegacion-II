import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { MisDatosComponent } from '../../components/mis-datos/mis-datos.component';
import { ExperienciaLaboralComponent } from '../../components/experiencia-laboral/experiencia-laboral.component';
import { CertificacionesComponent } from '../../components/certificaciones/certificaciones.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'mis-datos',
        component: MisDatosComponent
      },
      {
        path: 'experiencia-laboral',
        component: ExperienciaLaboralComponent
      },
      {
        path: 'certificaciones',
        component: CertificacionesComponent
      },
      {
        path: '',
        redirectTo: 'mis-datos',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
