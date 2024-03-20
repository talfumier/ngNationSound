import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {DataService } from '../../services/data/data.service';
import { Artist } from '../../services/interfaces';
import { environment } from '../../config/environment';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrl: './artist.component.css'
})
export class ArtistComponent implements OnInit{
  private _artist:Artist={} as Artist;

  constructor(private route: ActivatedRoute,service:DataService){
    const id = this.route.snapshot.paramMap.get("id");
    if(!id) return;
    this._artist=service.getArtistById(parseInt(id));    
  }
  ngOnInit(): void {
    window.scrollTo(0,0);
  }
  get artist():Artist{
    return this._artist;
  }  
  getArtistPath(artist:Artist){
    return environment.apiMode==="local"?('assets/images/artists/' + artist.filename):artist.image;
  }  
}
