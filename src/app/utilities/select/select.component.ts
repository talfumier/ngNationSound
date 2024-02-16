import { Component,Input, OnInit,HostListener  } from '@angular/core';
import { ControlContainer, NgModelGroup } from '@angular/forms';
import { KeyLabel, Option } from '../../../services/interfaces';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
  viewProviders: [{ provide: ControlContainer, useExisting: NgModelGroup }]
})
export class SelectComponent implements OnInit {
  @Input() cat:KeyLabel={} as KeyLabel;  
  @Input() options:Option[]=[];
  @Input() filter:object={} as object;

  private _highlighted:boolean=false;
  private _value:string|number="";

  ngOnInit(): void {   
    this._value=this.filter[this.cat.key as keyof object];
    if(!this.value) this.value=-1;
  }
  
  @HostListener('mouseenter') mouseover(event :Event){
    this._highlighted=true;
  }
  @HostListener('mouseleave') mouseleave(event :Event){
    this._highlighted=false;
  }
  get highlighted (){
    return this._highlighted;
  }
  get value(){
    return this._value;
  }
  set value(data){
    this._value=data;
  }
}
