import { Component,Input } from '@angular/core';
import { Faq } from '../../services/interfaces';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  @Input() data:Faq={} as Faq;

  private _isRotated:boolean=false;
  
  get faq() {
    return this.data;
  }
  get isRotated(){
    return this._isRotated;
  }
  rotateChevron(evt:Event) { 
    evt.stopPropagation();  
    this._isRotated=!this._isRotated;
  }
}
