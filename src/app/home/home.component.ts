import { Component, HostListener, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Infos, Faq, Message, Artist } from '../../services/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit,AfterViewInit,OnDestroy {  
  private _slideConfig:any;
  private _artists:Artist[]=[];
  private _messages:Message[]=[];
  private _innerHTML:string[]=[];
  private _infos:Infos={} as Infos;
  private _faqs:Faq[]=[];
  private _partners:string[]=[];
  static scrollY:number;

  constructor(private service:DataService,private router: Router){
    this._artists=service.artists;
    this._messages=service.messages;
    this._innerHTML=service.innerHTML;
    this._infos=service.infos;
    this._faqs=service.faqs;
    this._partners=service.partners;
  }

  ngOnInit(): void {
    document.getElementById("home-link")?.classList.add("active");
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
  ngAfterViewInit(): void {    
    setTimeout(() => {
      window.scrollTo(0,HomeComponent.scrollY);     
    },100);     
  }
  ngOnDestroy(): void {
    document.getElementById("home-link")?.classList.remove("active");
    HomeComponent.scrollY=window.scrollY; // record scroll position to be able to return at the same position
  }  
  get slideConfig(){
    return this._slideConfig;
  }
  get artists() {
    return this._artists;
  }
  get messages(){
    return this._messages;
  }
  get innerHTML():string[]{
    return this._innerHTML;
  }
  get infos() {
    return this._infos;
  }
  get faqs(){
    return this._faqs;
  }
  get partners(){
    return this._partners;
  }
  getPath(idx:number){
    return `assets/images/partners/${this._partners[idx]}`
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