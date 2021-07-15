import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  apiUrl : string;

  constructor() {
    this.apiUrl='';
   }

   getServerUrl(url: string) : string{
     return url;
   }
}
