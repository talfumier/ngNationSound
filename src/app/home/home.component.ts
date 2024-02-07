import { Component, ViewChild,ElementRef, OnInit } from '@angular/core';
import { EvtsSummaryService } from '../../services/evts-summary.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private _formattedData:string[]=[];
  isRotated:boolean[]=[false,false,false];

  @ViewChild('program') program: ElementRef={} as ElementRef;

  constructor(private service:EvtsSummaryService){
    this._formattedData=service.getFormattedData();
  }

  get formattedData():string[]{
    return this._formattedData;
  }
  rotateChevron(idx:number) {
    this.isRotated[idx]=!this.isRotated[idx];
  }

}
