import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EvtsSummaryService } from '../../services/evts-summary.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private _formattedData:string[]=[];

  constructor(private service:EvtsSummaryService){
    this._formattedData=service.getFormattedData();
  }

  get formattedData():string[]{
    return this._formattedData;
  }
  handleChange(form:NgForm) {
    console.log(form.value)
  }
}
