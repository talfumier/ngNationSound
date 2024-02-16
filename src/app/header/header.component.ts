import { Component,HostListener } from '@angular/core';
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

  constructor(private service:DataService, private window:Window ) {
    this._dates=service.dates;
  }

  get isToggled():boolean {
    return this._isToggled
  }
  get dates():any{
    return {days:this._dates.days.split(","),monthYear:this._dates.month+this._dates.year};
  }
  handleToggle(){
    this._isToggled=!this._isToggled;
  }
  handleClick() {
    this.window.scrollTo(0,0);
  }
  @HostListener('window:resize', ['$event'])
    onWindowResize() {
      if(window.outerWidth>=450) this._isToggled=false;
  }

}
