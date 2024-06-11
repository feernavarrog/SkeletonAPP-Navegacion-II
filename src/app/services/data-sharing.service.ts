import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {

  private certData = new BehaviorSubject<any>(null);
  certData$ = this.certData.asObservable();

  constructor() { }

  setCertData(data: any) {
    this.certData.next(data);
  }

}
