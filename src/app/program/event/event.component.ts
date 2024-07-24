import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../../services/data/data.service';
import { FilesService } from './../../../services/data/files.service';
import { ArtistEvents } from '../../../services/interfaces';
import {
  removeAccents,
  getFormattedDate,
} from '../../utilities/functions/utlityFunctions';
import { environment } from '../../../config/environment';

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
  formattedDate(date: string) {
    //work-around to avoid 'invalid date' warning on ios devices
    return getFormattedDate(
      date,
      environment.apiMode === 'local'
        ? 'dd.MM.yyyy HH:mm'
        : 'yyyy-MM-dd HH:mm:ss'
    );
  }
  cleanup(type: string, location: string) {
    if (type.includes('rencontre')) return 'rencontre';
    return removeAccents(location);
  }
  getArtistPath(event: ArtistEvents) {
    // return environment.apiMode==="local"?('assets/images/artists/' + event.performer.filename):event.performer.image;
  }
  getFileData(event: ArtistEvents) {
    console.log(event);
    // return this.fileService.getFileData(col, _id);
  }
}
