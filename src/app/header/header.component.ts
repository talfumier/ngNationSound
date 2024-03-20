import { Component,HostListener, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import _ from 'lodash';
import { DataService,} from '../../services/data/data.service';
import { ApiService } from '../../services/data/init/api.service';
import { environment } from '../../config/environment';
import { getFormattedDate } from '../utilities/functions/utlityFunctions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit,OnDestroy{   
  private sub:Subscription={} as Subscription;
  private _isToggled:boolean=false;
  private _dates:any={days:[],monthYear:""};

  constructor(private dataService:DataService, private apiService:ApiService,private window:Window) {  
  }

  ngOnInit(): void {
    if(environment.apiMode!=="local" && !this.dataService.data.dates.ready) //retrieve data from API back end
      this.sub=this.apiService.getApiObs("dates").subscribe((data) => {
        this.apiService.formatApiData("dates",data);
        this._dates=this.getDaysMonthYear();
      });
    else 
      this._dates=this.getDaysMonthYear(); //api data already initialized or local data
  }
  getDaysMonthYear(){
    const days=_.range(this.dataService.dates.start_date.getDate(),this.dataService.dates.end_date.getDate()+1);
    let monthYear=`${new Date((this.dataService.dates.start_date.getMonth()+1)+" "+days[0]+","+this.dataService.dates.start_date.getFullYear()).toLocaleString("fr-FR",{year:"numeric",month:"long"})}`;    
    monthYear=getFormattedDate(monthYear,"MMMM yyyy","MMMM yyyy"); //work-around to avoid 'invalid date' warning on ios devices
    return {days,monthYear};
  }
  ngOnDestroy(): void {
    if(Object.keys(this.sub).length>0) this.sub.unsubscribe();
  }

  get isToggled():boolean {
    return this._isToggled
  }
  get dates(){
    return this._dates;
  }
  handleToggle(){
    this._isToggled=!this._isToggled;
  }
  handleClick(event?:Event) {  
    this.window.scrollTo(0,0);
  }
  @HostListener('window:resize', ['$event'])
    onWindowResize() {
      if(window.outerWidth>=450) this._isToggled=false;
  }

}
