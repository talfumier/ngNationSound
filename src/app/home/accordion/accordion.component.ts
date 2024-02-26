import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, NgModelGroup } from '@angular/forms';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css',
  viewProviders: [{ provide: ControlContainer, useExisting: NgModelGroup }]
})
export class AccordionComponent implements OnInit { 
  @Input() title:string="";     
  @Input() index:string="";     

  private _value:boolean=false; // value binded to NgForm in home page
  static status:Status={"0":false,"1":false,"2":false,"3":false,"4":false};

  ngOnInit(): void {
    this._value=AccordionComponent.status[this.index as keyof object] ;
  }
  get value(){
    return this._value;
  }
  set value(data){
    this._value=data;
  }

  rotateChevron(evt?:Event) { 
    if(evt) evt.stopPropagation();  
    this._value=!this._value;
    AccordionComponent.status[this.index as keyof Status]=this.value;
  }
}
interface Status { //rotated status of each accordion
  "0":boolean,
  "1":boolean,
  "2":boolean
  "3":boolean
  "4":boolean
}
