import { Component,HostListener} from '@angular/core';
import _ from 'lodash';
import { DataService,} from '../../services/data/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent{   
  private _isToggled:boolean=false;
  private _dates:any={days:[],monthYear:""};

  constructor(private dataService:DataService, private window:Window) {
    const days=_.range(this.dataService.dates.start_date.getDate(),this.dataService.dates.end_date.getDate()+1);
    const monthYear=`${new Date((this.dataService.dates.start_date.getMonth()+1)+" "+days[0]+","+this.dataService.dates.start_date.getFullYear()).toLocaleString("fr-FR",{year:"numeric",month:"long"})}`;    
    this._dates={days,monthYear};
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
