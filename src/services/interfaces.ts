export interface Poi {
  id:string,
  name:string,
  type:string
}
export interface Dates{
  days:string,
  month:string,
  year:number,
  opening:string
}
export interface Artist {
  id:number,
  name:string,
  country:string,
  description:string,
  composition:string,
  style:string,
  cat:string | number
}
export interface Style {
  id:number,
  description:string
}
export interface EventType {
  id:number,
  description:string
}
export interface Event {
  performer: Artist,
  type: EventType,
  location: Poi,
  date: string
}
export interface ArtistEvents {
  performer:Artist,
  dates:EventDate[]
}
interface EventDate {
  date:Date,
  location:Poi,
  type:EventType
}

export interface KeyLabel {
  key:string|number, label:string
}
export interface MinMax {
  min:string | number,max:string | number
}
export interface TimeOptions {
  "min":Option[],"max":Option[]
}
export interface Option {
  id:(string|number),name:string
}
export interface Filter {
  days:object,
  time:object,
  types:object,
  artist:object
}