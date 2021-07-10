import { Injectable } from '@angular/core';
import {  ConfigService} from './share/config.service'
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable, throwError,of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {StockDetail} from '../entity/stock-detail'


@Injectable({
  providedIn: 'root'
})
export class StockService {
  getStockDetailUrl:string;
  constructor(private httpClient : HttpClient ,private configService : ConfigService) {
    this.getStockDetailUrl='api/v1.0/market/stock/get';
}
getStockDetails(companyCode:string,startDate:string,endDate:string): Observable<StockDetail>{
  const url =this.configService.getServerUrl(this.getStockDetailUrl);
  return this.httpClient.get<StockDetail>(`${url}/${companyCode}/${startDate}/${endDate}`)
  .pipe(
    map((response : any)=>{
      return response.result.map((x : any)=>{
        return new StockDetail(x.stockId,x.stockPrice,x.stockDateTime,x.time,x.companyCode);
      });
    }),
    catchError(this.handleError<StockDetail>('getStockDetails',new StockDetail('',0,'','','')))
  );
}

private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    this.log(error);
    this.log(`${operation} failed: ${error.message}`);
    return throwError(error);
  };
}

private log(message: string) {
  console.log(message);
}
}
