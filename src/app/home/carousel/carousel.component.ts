import { Component} from '@angular/core';
import { Artist } from '../../../services/interfaces';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent  {
  private _artists:Artist[]=[];
  private _slideConfig:any;

  constructor(private service:DataService){ 
   this._artists=service.artists;
   this._slideConfig= {
    "autoplay":true,
    "autoplaySpeed":2500,
    "pauseOnHover":true,    
    "arrows":true,
    "infinite":true,  
    "slidesToShow":3,
    "slidesToScroll":1,   
    "responsive":[
      {
        "breakpoint": 600,
        "settings":{
          "slidesToShow":1,
          "slidesToScroll":1,
        }
      },
      {
        "breakpoint": 968,
        "settings":{
          "slidesToShow":2,
          "slidesToScroll":1,
        }
      },
      
    ],
  
  };  
  }
  get artists(){
    return this._artists;
  }
  get slideConfig(){
    return this._slideConfig;
  }
}
