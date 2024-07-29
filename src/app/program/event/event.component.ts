import { Component, Input, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ApiService } from '../../../services/data/init/api.service';
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

  constructor(private apiService: ApiService) {}

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
  getFileData(_id?: string) {
    return _id ? this.apiService.fileData[_id as keyof object] : '';
  }
}
