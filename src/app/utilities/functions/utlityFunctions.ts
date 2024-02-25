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