import { Injectable } from '@angular/core';
import _ from 'lodash';
import { format } from 'date-fns';
import {
  Poi,
  Dates,
  Artist,
  Event,
  Infos,
  Model,
  Transport,
} from '../interfaces';
import { removeAccents } from '../../app/utilities/functions/utlityFunctions';

@Injectable({
  providedIn: 'root', // single instance for the entire application
})
export class DataService {
  private _innerHTML: string[] = []; // data formatting as html string for use in events summary (home page)
  private _data: Model = {
    logos: { data: [], ready: false },
    messages: { data: [], ready: false },
    dates: { data: {} as Dates, ready: false },
    pois: { data: [], ready: false },
    artists: { data: [], ready: false },
    infos: { data: {} as Infos, ready: false },
    faqs: { data: [], ready: false },
    partners: { data: [], ready: false },
    passes: { data: [], ready: false },
    events: { data: [], ready: false },
    newsletters: { data: [], ready: false },
    maps: { data: {}, ready: false },
  };

  constructor() {}

  initInnerHTML() {
    // data formatted as html string for use in events summary (home page)
    this._innerHTML = [''];
    _.range(
      this._data.dates.data.start_date.getDate(),
      this._data.dates.data.end_date.getDate() + 1
    ).map((day) => {
      this._innerHTML.push(
        format(
          new Date(
            this._data.dates.data.start_date.getFullYear(), //work-around to avoid 'invalid date' warning on ios devices
            this._data.dates.data.start_date.getMonth(),
            day
          ),
          'dd MMMM'
        )
      );
    });
    this._innerHTML.map((item, idx) => {
      this._innerHTML[idx] = `<div class='column-header'>${item}</div>`;
    });

    const stages = _.filter(this._data.pois.data, (poi) => {
      return poi.type === 'stage';
    });
    let day = '',
      ul = '',
      artist = '';
    stages.map((stage) => {
      this._innerHTML.push(
        `<div class='row-header'><a href='/map/${removeAccents(stage.name)}'>${
          stage.name
        }</a></div>`
      );
      (day = ''), (ul = '');
      _.sortBy(
        _.filter(this._data.events.data, (evt) => {
          return evt.location === stage.id;
        }),
        'date',
        'asc'
      ).map((evt) => {
        let x = new Date(evt.date);
        if (x.getDate().toString() !== day) {
          if (ul.length > 0) this._innerHTML.push(ul + '</ul>');
          ul = "<ul class='list-group-program'>";
          day = x.getDate().toString();
        }
        artist = _.filter(this._data.artists.data, (item) => {
          return item.id == evt.performer;
        })[0].name;
        ul =
          ul +
          `<li class='list-group-item-program'>${format(x, 'HH:mm').replace(
            ':',
            'h'
          )} <a href='/artist/${evt.performer}'>${artist}</a></li>`;
      });
      if (ul.length > 0) this._innerHTML.push(ul + '</ul>');
    });
  }

  formatApiData(col: string, data: any) {
    switch (col) {
      case 'messages':
        this._data.messages = {
          data: data.map((msg: any) => {
            return msg;
          }),
          ready: true,
        };
        break;
      case 'dates':
        this._data.dates = {
          data: {
            start_date: new Date(data[0].start_date),
            end_date: new Date(data[0].end_date),
          },
          ready: true,
        };
        this._data.infos = {
          data: {
            opening: data[0].opening_hours,
            street: data[0].street,
            city: data[0].city,
            lat: data[0].lat,
            lng: data[0].lng,
            transport: this._data.infos.data.transport,
          },
          ready: true,
        };
        break;
      case 'logos':
      case 'artists':
      case 'partners':
      case 'pois':
      case 'faqs':
      case 'events':
      case 'newsletters':
        this._data[col] = {
          data,
          ready: true,
        };
        break;
      case 'maps':
        this._data[col] = {
          data: data[0],
          ready: true,
        };
        break;
      case 'transports':
        this._data.infos.data.transport = {
          car: [],
          train: [],
          plane: [],
        };
        _.sortBy(data, 'title', 'asc').map((item: any) => {
          this._data.infos.data.transport[
            item.transport_mean as keyof Transport
          ].push(item.description);
        });
        break;
      case 'tickets':
        this._data.passes = {
          data: data.map((item: any) => {
            return {
              category: item.acf.category,
              pass1: item.acf.price_1day,
              pass2: item.acf.price_2days,
              pass3: item.acf.price_3days,
            };
          }),
          ready: true,
        };
        break;
    }
  }
  getArtistById(id: number): Artist {
    return _.filter(this._data.artists.data, (artist) => {
      return artist.id === id;
    })[0];
  }
  displayLoading(cs: boolean) {
    const elt = document.getElementById('splashScreen');
    if (cs) elt?.classList.remove('hidden');
    else elt?.classList.add('hidden');
  }
  get data() {
    return this._data;
  }
  set data(dta) {
    this._data = dta;
  }
  get logos() {
    return this._data.logos.data;
  }
  get messages() {
    return this._data.messages.data;
  }
  get innerHTML(): string[] {
    return this._innerHTML;
  }
  get dates(): Dates {
    return this._data.dates.data;
  }
  get pois(): Poi[] {
    return this._data.pois.data;
  }
  get artists(): Artist[] {
    return this._data.artists.data;
  }
  get events(): Event[] {
    return this._data.events.data;
  }
  get infos(): Infos {
    return this._data.infos.data;
  }
  get faqs() {
    return this._data.faqs.data;
  }
  get partners() {
    return this._data.partners.data;
  }
  get passes() {
    return this._data.passes.data;
  }
  get newsLetters() {
    return this._data.newsletters;
  }
  get maps() {
    return this._data.maps.data;
  }
}
