import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  selectedSegment: string = 'mis-datos';

constructor(
  private router: Router,
  private authService: AuthService
) {}

  
segmentChanged($event: CustomEvent) {
  let direction = $event.detail.value;
  this.router.navigate([`home/${direction}`]);
}

changeSegment(segment: string) {
  this.selectedSegment = segment;
}

ionViewWillEnter() {
  this.router.navigate(['home/mis-datos']);
}

logout() {
  this.authService.logout();
}
}
