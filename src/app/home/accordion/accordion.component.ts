import { Component,Input, OnInit } from '@angular/core';
import { ControlContainer, NgModelGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css',
  viewProviders: [{ provide: ControlContainer, useExisting: NgModelGroup }]
})
export class AccordionComponent implements OnInit {    
  @Input() title:string=""; 

  private _value:boolean=false;

  constructor(private route: ActivatedRoute,private location: Location){}

  ngOnInit(): void {
    const param:string=this.route.snapshot.queryParamMap.get('param') as string;
    if(param==="program" && this.title==="programmation") {
      this.rotateChevron();
      this.location.replaceState("/");//remove query parameter from url
    }    
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
  }
}
