import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  apiUrl : string;

  constructor() {
    this.apiUrl='http://localhost:50461/';
   }

   getServerUrl(url: string) : string{
     return this.apiUrl+url;
   }
}
