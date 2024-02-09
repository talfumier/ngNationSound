import {Component,HostListener} from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {  

  private _innerHTML:string[]=[];

  constructor(private service:DataService,private router: Router,private route: ActivatedRoute){
    this._innerHTML=service.innerHTML;
  }
  get innerHTML():string[]{
    return this._innerHTML;
  }

  @HostListener("click", ['$event']) // prevent page reload when launching an anchor link
  onClick(event: MouseEvent) {
    if (event.target instanceof HTMLAnchorElement === false)  
      return;   
    event.preventDefault(); // Prevent page from reloading
    const target = <HTMLAnchorElement>event.target;
    this.router.navigate([target.pathname]);
  }
}