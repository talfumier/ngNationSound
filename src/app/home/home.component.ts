import { Component, HostListener, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import {Router } from '@angular/router';
import { DataService } from '../../services/data/data.service';
import { Infos, Faq, Message, Artist} from '../../services/interfaces';
import { environment } from '../../config/environment';

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
  private _partners:any[]=[];
  static scrollY:number;
  
  constructor(private dataService:DataService,private router: Router) {
    this._artists=dataService.artists;
    this._messages=dataService.messages;
    dataService.initInnerHTML();
    this._innerHTML=dataService.innerHTML;
    this._infos=dataService.infos;
    this._faqs=dataService.faqs;
    this._partners=dataService.partners;
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
  getArtistPath(artist:Artist){
    return environment.apiMode==="local"?('assets/images/artists/' + artist.filename):artist.image;
  }
  getPartnerPath(idx:number){
    return environment.apiMode==="local"?`assets/images/partners/${this._partners[idx]}`:this._partners[idx].image;    
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