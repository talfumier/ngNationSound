import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {DataService } from '../../services/data.service';
import { Artist } from '../../services/interfaces';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrl: './artist.component.css'
})
export class ArtistComponent{
  private _artist:Artist={} as Artist;

  constructor(private route: ActivatedRoute,service:DataService){
    const id = this.route.snapshot.paramMap.get("id");
    if(!id) return;
    this._artist=service.getArtistById(parseInt(id));    
  }
  get artist():Artist{
    return this._artist;
  }
  
}
