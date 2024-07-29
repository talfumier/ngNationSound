import { TestBed } from '@angular/core/testing';
import _ from 'lodash';
import { differenceInCalendarDays } from 'date-fns';
import { DataService } from './data.service';

function validHTML(htmlString: string): boolean {
  let parser = new DOMParser();
  let doc = parser.parseFromString(htmlString, 'application/xml');
  let error = doc.querySelector('parsererror');
  return error ? false : true;
}
describe('DataService', () => {
  let service: DataService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
    // service.loadLocalData(); // use local data from data.json
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should have a initInnerHTML() method that initiates a innerHTML property as an array of strings of a given length', () => {
    const stages = _.filter(service.pois, (poi) => {
      return poi.type === 'stage';
    });
    const n =
      (differenceInCalendarDays(
        service.dates.end_date,
        service.dates.start_date
      ) +
        2) *
      (stages.length + 1);
    expect(service.innerHTML.length).toBe(n);
  });
  it('should have a innerHTML property that returns an array of valid HTML strings', () => {
    const valid: boolean[] = [];
    service.innerHTML.map((str: string) => {
      valid.push(validHTML(str));
    });
    expect(valid.indexOf(false)).toBe(-1);
  });
  it('should have a getArtistById() method that returns an artist object of the given id if id does exist', () => {
    const id = 12;
    expect(service.getArtistById(id).id).toBe(id);
  });
  it('should have a getArtistById() method that returns undefined if id does not exist', () => {
    const id = -12;
    expect(_.isUndefined(service.getArtistById(id))).toBe(true);
  });
});
