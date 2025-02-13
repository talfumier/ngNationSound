import { Injectable } from '@angular/core';
import _ from 'lodash';
import { format, isWithinInterval, interval, addDays } from 'date-fns';
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
  private _days: number[] = [];

  constructor() {}

  initDays() {
    //initialization in header.component.ts
    const int = interval(
      this._data.dates.data.start_date,
      this._data.dates.data.end_date
    );
    let i = 0;
    const days = [];
    do {
      days.push(addDays(this._data.dates.data.start_date, i).getDate());
      i += 1;
    } while (
      addDays(this._data.dates.data.start_date, i) <=
      this._data.dates.data.end_date
    );
    this._days = days;
  }
  initInnerHTML() {
    // data formatted as html string for use in events summary (home page)
    this._innerHTML = [''];
    let dte = null;
    this._days.map((day, idx) => {
      dte = addDays(this._data.dates.data.start_date, idx);
      this._innerHTML.push(
        format(
          new Date(
            dte.getFullYear(), //work-around to avoid 'invalid date' warning on ios devices
            dte.getMonth(),
            day
          ),
          'dd MMM'
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
          return (
            evt.location === stage.id &&
            isWithinInterval(evt.date, {
              start: this._data.dates.data.start_date,
              end: addDays(this._data.dates.data.end_date, 1),
            })
          );
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
          data: data.data.map((item: any) => {
            const { id, createdAt, updatedAt, ...rest } = item;
            return rest;
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
  get days() {
    return this._days;
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
