import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, NgModelGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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
  private static status:Status={"0":false,"1":false};

  constructor(private route: ActivatedRoute, private window:Window, private document:Document){}

  ngOnInit(): void {
    const param:string=this.route.snapshot.queryParamMap.get('param') as string;
    if(param==="program" && this.title==="concerts 2024") {
      this.document.getElementById("home-link")?.click();
      this.rotateChevron();
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
    AccordionComponent.status[this.index as keyof Status]=this.value;
    if(JSON.stringify(AccordionComponent.status).indexOf("true")===-1)
      this.window.scrollTo(0,0);
  }
}
interface Status { //rotated status of each accordion
  "0":boolean,
  "1":boolean
}
