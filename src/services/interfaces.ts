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
export interface Event {
  performer: Artist,
  type: string,
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
  type:string
}