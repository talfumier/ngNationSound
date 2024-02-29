import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormattedPass } from '../../services/interfaces';

@Component({
  selector: 'app-ticketing',
  templateUrl: './ticketing.component.html',
  styleUrl: './ticketing.component.css'
})
export class TicketingComponent {
  private _formattedData:{pass1:FormattedPass[],pass2:FormattedPass[],pass3:FormattedPass[]}={pass1:[],pass2:[],pass3:[]};

  constructor(private service:DataService) {
    service.passes.map((pass) => {
      Object.keys(pass).map((key) => {
        if(key!=="category")
          (this._formattedData[key as keyof object] as Array<FormattedPass>).push({category:pass.category,price:pass[key as keyof object]} );
      })
    });
  }
  get formattedData(){
    return Object.values(this._formattedData);
  }
}




