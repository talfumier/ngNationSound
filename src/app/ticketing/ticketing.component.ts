import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { DataService } from '../../services/data/data.service';
import { FormattedPass } from '../../services/interfaces';
import { environment } from '../../config/environment';
import { ApiService } from '../../services/data/init/api.service';

@Component({
  selector: 'app-ticketing',
  templateUrl: './ticketing.component.html',
  styleUrl: './ticketing.component.css'
})
export class TicketingComponent implements OnInit, OnDestroy {  
  private sub:Subscription={} as Subscription;
  private _formattedData:{pass1:FormattedPass[],pass2:FormattedPass[],pass3:FormattedPass[]}={pass1:[],pass2:[],pass3:[]};

  constructor(private dataService:DataService,private apiService:ApiService) {
  }

  ngOnInit(): void {    
    if(environment.apiMode!=="local" && !this.dataService.data.passes.ready) { //retrieve data from API back end
      if(!this.dataService.data.events.ready) { //page reload case > full api data reload required
        const cols=["artists","messages","transports","faqs","partners","pois","events"];
        forkJoin(cols.map((col:string) => {
          return this.apiService.getApiObs(col);
        })).subscribe((data) => {
          data.map((item,idx) => {
            this.apiService.formatApiData(cols[idx],item);
          }); 
        });
      }
      this.sub=this.apiService.getApiObs("tickets").subscribe((data) => {
        this.apiService.formatApiData("tickets",data);
        this.formatData();
      });
    }
    else this.formatData(); //api data already initialized or local data    
  }
  formatData(){
    this.dataService.passes.map((pass) => {
      Object.keys(pass).map((key) => {
        if(key!=="category")
          (this._formattedData[key as keyof object] as Array<FormattedPass>).push({category:pass.category,price:pass[key as keyof object]} );
      })
    });
  }
  ngOnDestroy(): void {
    if(Object.keys(this.sub).length>0) this.sub.unsubscribe();    
  }
  get formattedData(){
    return Object.values(this._formattedData);
  }
}




