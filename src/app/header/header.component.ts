import { Component,HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {  
  private _isToggled:boolean=false;

  get isToggled():boolean {
    return this._isToggled
  }
  handleToggle(){
    this._isToggled=!this._isToggled;
  }
  @HostListener('window:resize', ['$event'])
    onWindowResize() {
      if(window.outerWidth>=450) this._isToggled=false;
  }

}
