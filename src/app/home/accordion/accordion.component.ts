import { Component,Input,ViewChild,ElementRef } from '@angular/core';
import { ControlContainer, NgModelGroup } from '@angular/forms';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css',
  viewProviders: [{ provide: ControlContainer, useExisting: NgModelGroup }]
})
export class AccordionComponent {    
  @Input() title:string="";
  @ViewChild('checkbox') cb: ElementRef={} as ElementRef;
  private _value:boolean=false;

  get value(){
    return this._value;
  }
  set value(data){
    this._value=data;
  }

  rotateChevron() {
    this.cb.nativeElement.click()
  }
}
