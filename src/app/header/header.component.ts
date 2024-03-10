import { Component,HostListener } from '@angular/core';
import _ from 'lodash';
import { DataService } from '../../services/data.service';
import { Dates } from '../../services/interfaces';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {  
  private _isToggled:boolean=false;
  private _dates:Dates={} as Dates;

  constructor(private service:DataService, private window:Window) {
    this._dates=service.dates;
  }

  get isToggled():boolean {
    return this._isToggled
  }
  get dates():any{
    const days=_.range(this._dates.start_date.getDate(),this._dates.end_date.getDate()+1);
    return {days,monthYear:`${new Date((this._dates.start_date.getMonth()+1)+" "+days[0]+","+this._dates.start_date.getFullYear()).toLocaleString("fr-FR",{year:"numeric",month:"long"})}`};
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
