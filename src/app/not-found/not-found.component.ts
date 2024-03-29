import { Component } from '@angular/core';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  constructor(dataService:DataService){    
      dataService.displayLoading(false);
  }

}
