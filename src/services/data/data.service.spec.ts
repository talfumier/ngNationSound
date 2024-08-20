import { TestBed, inject } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import _ from 'lodash';
import { differenceInCalendarDays } from 'date-fns';
import { DataService } from './data.service';
import { ApiService } from './init/api.service';
import mockAPIData from './simulatedAPIData.json';

function validHTML(htmlString: string): boolean {
  let parser = new DOMParser();
  let doc = parser.parseFromString(htmlString, 'application/xml');
  let error = doc.querySelector('parsererror');
  return error ? false : true;
}
describe('services', () => {
  let apiService: ApiService, dataService: DataService;
  const cols = [
    'dates',
    'artists',
    'messages',
    'transports',
    'faqs',
    'partners',
    'pois',
    'events',
    'newsletters',
  ];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService, ApiService],
    });
    dataService = TestBed.inject(DataService);
    apiService = TestBed.inject(ApiService);
    mockAPIData.map((item, idx) => {
      dataService.formatApiData(
        cols[idx],
        cols[idx] === 'artists' ? _.orderBy(item.data, 'name') : item.data
      );
    });
  });
  it('dataService should be available', () => {
    expect(dataService).toBeTruthy();
  });
  it('apiService should be available', () => {
    expect(apiService).toBeTruthy();
  });
  it('should call dataService.formatApiData() for formatting simulated data returned by the API and populate dataService data', () => {
    expect(dataService.artists.length).toEqual(15);
  });
  it('should have a initInnerHTML() method that initiates a innerHTML property as an array of strings of a given length', () => {
    const stages = _.filter(dataService.pois, (poi) => {
      return poi.type === 'stage';
    });
    const n =
      (differenceInCalendarDays(
        dataService.dates.end_date,
        dataService.dates.start_date
      ) +
        2) *
      (stages.length + 1);
    dataService.initInnerHTML();
    expect(dataService.innerHTML.length).toBe(n);
  });
  it('should have a innerHTML property that returns an array of valid HTML strings', () => {
    const valid: boolean[] = [];
    dataService.innerHTML.map((str: string) => {
      valid.push(validHTML(str));
    });
    expect(valid.indexOf(false)).toBe(-1);
  });
  it('should have a getArtistById() method that returns an artist object of the given id if id does exist', () => {
    const id = 28888;
    expect(dataService.getArtistById(id).id).toBe(id);
  });
  it('should have a getArtistById() method that returns undefined if id does not exist', () => {
    const id = -12;
    expect(_.isUndefined(dataService.getArtistById(id))).toBe(true);
  });
});
