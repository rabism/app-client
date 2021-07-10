import { Component, OnInit,OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {CompanyService} from '../../service/company.service';
import {UserService} from '../../service/user.service';
import { finalize } from 'rxjs/operators';
import {CompanyDetail} from '../../entity/company-detail'
import {FormControl, Validators} from '@angular/forms';
import {StockDetail} from '../../entity/stock-detail';
import  {StockService} from '../../service/stock.service';
import { AppConstants } from '../../entity/appConstants'
import {EventBroadcastService} from '../../service/share/event-broadcast.service';
import {EventType} from '../../entity/eventType';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment} from 'moment';
import { ThrowStmt } from '@angular/compiler';

const moment = _rollupMoment || _moment;
@Component({
  selector: 'app-stock-search',
  templateUrl: './stock-search.component.html',
  styleUrls: ['./stock-search.component.css']
 // encapsulation: ViewEncapsulation.None
})
export class StockSearchComponent implements OnInit,OnDestroy {
  getAllCompanySubscription: Subscription;
  getCompanyByCodeSubscription: Subscription;
  getAllStockSubscription: Subscription;
  companyDetailsArray:CompanyDetail[];
  stockDetail : StockDetail[];
  companyDetail: CompanyDetail;
  selectedCompany:string='';
  companyControl = new FormControl('', Validators.required);
  today:Date=new Date();
  startDate = new FormControl(moment());
  endDate = new FormControl(moment());
  isLoading=false;
  hasData=false;
  isCompLoading=false;
  hasCompDetailsError=false;
  hasError=false;
  minPrice:number=0;
  maxPrice:number=0;
  displayedColumns: string[] = ['stockPrice', 'stockDateTime', 'time'];
  startDateShow:string;
  endDateShow:string;
  isUserClickOnSearch=false;
  isAuthenticateUser=false;
  constructor(private companyService:CompanyService
    ,private userService :UserService
    ,private stockService:StockService
    ,private eventBroadcastService:EventBroadcastService
    ) { }

  ngOnInit(): void {
    this.setAuthentication();
    this.getAllCompany();
    let before7day = new Date();
    before7day.setDate(before7day.getDate()-7)
    this.startDate.setValue(before7day);
    this.eventBroadcastService.on(EventType.LOGIN_SUCCESS).subscribe(event => this.handleEvent(event.payload));
  }
  handleEvent(event: any) {
    this.setAuthentication();
    this.getAllCompany();
  }
 
  setAuthentication(){
    this.isAuthenticateUser=this.userService.isAuthenticate;
  }
  
  
  getAllCompany(){
      if(!this.isAuthenticateUser)
      return;

     if(this.getAllCompanySubscription)
        this.getAllCompanySubscription.unsubscribe();
     this.getAllCompanySubscription=this.companyService.getAllCompany().pipe(finalize(()=>{
        
      }))
      .subscribe((data : any)=>{
        this.companyDetailsArray=[...data.result];  
      },
      (error: any)=>{
          this.setError(error);
      });
  }
  onSearchClick($event:any){
    $event.stopPropagation();
    this.isUserClickOnSearch=true;
    this.getCompanyByCode();
    this.getStock();

  }
  getCompanyByCode(){
    this.isCompLoading=true;
    this.hasCompDetailsError=false;
    this.startDateShow=moment(this.startDate.value).format(AppConstants.DATE_FORMAT);
    this.endDateShow=moment(this.endDate.value).format(AppConstants.DATE_FORMAT);
    if(this.getCompanyByCodeSubscription)
     this.getCompanyByCodeSubscription.unsubscribe();
     const companyCode:string = this.companyControl.value?.companyCode ?? '';
     this.getAllCompanySubscription=this.companyService.getCompanyDetailsByCode(companyCode).pipe(finalize(()=>{
      this.isCompLoading=false;
     }))
     .subscribe((data : any)=>{
       this.companyDetail={...data.result}   
     },
     (error: any)=>{
         this.setError(error);
         this.isCompLoading=false;
         this.hasCompDetailsError=true;
     });
 }
 getStock(){
   this.isLoading=true;
   this.hasData=false;
   this.hasError=false;
  if(this.getAllStockSubscription)
   this.getAllStockSubscription.unsubscribe();
   const companyCode:string = this.companyControl.value?.companyCode ?? '';
   const startDate:string = moment(this.startDate.value).format('YYYY-MM-DD');
   const endDate:string = moment(this.endDate.value).format('YYYY-MM-DD');
   this.getAllCompanySubscription=this.stockService.getStockDetails(companyCode,startDate,endDate).pipe(finalize(()=>{
    this.isLoading=false;
   }))
   .subscribe((data : any)=>{
     this.stockDetail =[...data]; 
     this.hasData=this.stockDetail.length>0;  
   },
   (error: any)=>{
       this.setError(error);
      // this.isLoading=false;
       this.hasData=false;
       this.hasError=true;
   });
}
ngOnDestroy():void{
    this.getAllCompanySubscription?.unsubscribe();
    this.getCompanyByCodeSubscription?.unsubscribe();
    this.getAllStockSubscription?.unsubscribe();
  }
  setError(error:any): void{
    console.log(error);
    
  }
}
