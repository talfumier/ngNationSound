import { Component, Input, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DataService } from '../../../services/data/data.service';
import { FilesService } from './../../../services/data/files.service';
import { ArtistEvents } from '../../../services/interfaces';
import { removeAccents } from '../../utilities/functions/utlityFunctions';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
})
export class EventComponent implements OnInit {
  @Input() data: ArtistEvents = {} as ArtistEvents;

  private _event: ArtistEvents = {} as ArtistEvents;

  constructor(
    private dataService: DataService,
    private fileService: FilesService
  ) {}

  ngOnInit(): void {
    this._event = this.data;
  }

  get event(): ArtistEvents {
    return this._event;
  }
  formattedDate(date: any) {
    //work-around to avoid 'invalid date' warning on ios devices
    return format(date, 'dd MMMM - HH:mm', {
      locale: fr,
    }).replace(':', 'h');
  }
  cleanup(type: string, location: string) {
    if (type.includes('rencontre')) return 'rencontre';
    return removeAccents(location);
  }
  getArtistPath(event: ArtistEvents) {
    // return environment.apiMode==="local"?('assets/images/artists/' + event.performer.filename):event.performer.image;
  }
  getFileData(event: ArtistEvents) {
    return '';
    // return this.fileService.getFileData(col, _id);
  }
}
