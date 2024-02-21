import { Component, HostListener, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { AccordionComponent } from './accordion/accordion.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit,AfterViewInit,OnDestroy {  

  private _innerHTML:string[]=[];
  static scrollY:number;

  constructor(private service:DataService,private router: Router){
    this._innerHTML=service.innerHTML;
  }

  ngOnInit(): void {
    document.getElementById("home-link")?.classList.add("active");
  }
  ngAfterViewInit(): void {   
    setTimeout(() => {    
    if(JSON.stringify(AccordionComponent.status).indexOf("true")===-1){
      window.scrollTo(0,0);
      HomeComponent.scrollY=0;
    }
    else window.scrollTo(0,HomeComponent.scrollY);   
    },100);
  }
  ngOnDestroy(): void {
    document.getElementById("home-link")?.classList.remove("active");
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
  @HostListener('window:scroll', ['$event'])
  onScroll() {
    HomeComponent.scrollY=window.scrollY; // record scroll position to be able to return at the same position
  }
}