import {format,parse} from 'date-fns';
import { environment } from '../../../config/environment';

export function removeAccents(str:string):string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(' ','%20').toLowerCase();
}
export function getDateFromString(date:any,format:string,output?:string):Date|number {
  let result:any=null;
  switch(format){
    case "dd.mm.yyyy hh:mm":
      result=date.toString().split(" ")[0].split(".");
      const x=result[0];
      result[0]=result[1],result[1]=x;
      result[3]=date.toString().split(" ")[1];
      result=result.join();
      break;
  } 
  return output==="ms"?Date.parse(result) as number:new Date(result);
}
export function getFormattedDate(date:string,fmt:string,output_fmt?:string):string { //fmt > date parameter format
    // const fmt=environment.apiMode==="local"?"dd.MM.yyyy HH:mm":"yyyy-MM-dd HH:mm:ss";
    return format(parse(date,fmt,new Date()),!output_fmt?"dd MMMM '-' HH'h'mm":output_fmt);
  }