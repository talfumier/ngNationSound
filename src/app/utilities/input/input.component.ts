import { Component,Input,HostListener, OnInit } from '@angular/core';
import { ControlContainer, NgModelGroup } from '@angular/forms';
import { KeyLabel,Filter } from '../../../services/interfaces';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  viewProviders: [{ provide: ControlContainer, useExisting: NgModelGroup }]
})
export class InputComponent implements OnInit  {  
  @Input() cat:KeyLabel={} as KeyLabel;  
  @Input() filter:any;   

  private _value:boolean=false;
  
  ngOnInit(): void {
    this._value=this.filter[this.cat.key as keyof KeyLabel]
  }
  get value(){
    return this._value;
  }
  set value(data){
    this._value=data;
  }
  private _highlighted:boolean=false;
  @HostListener('mouseenter') mouseover(event :Event){
    this._highlighted=true;
  }
  @HostListener('mouseleave') mouseleave(event :Event){
    this._highlighted=false;
  }
  get highlighted (){
    return this._highlighted;
  }
}