// --- angular.json ---
//"scripts": ["/src/assets/js/jsfunctions.js"]
// --- IN COMPONENT ---
// declare function filterEvent(
//   dates: any,
//   types: any,
//   artist: any,
//   event: Event
// ): boolean;

function filterEvent(dates, types, artist, event, cs) {
  const bl = new Array(3);
  bl.fill(false);
  // dealing with 'Quand ? A quelle heure ?' filter
  Object.keys(dates).map((key) => {
    //&& event.datems>=(dates[key] as number+dates.time.min) && event.datems<=(dates[key] as number+dates.time.max)
    if (key !== "time" && !bl[0]) {
      console.log(event.datems, dates[key], dates.time.min);
      // window.alert(event.datems);
      // window.alert(dates[key]);
      // window.alert(dates.time.min);
      bl[0] = true;
      // console.log(key,dates[key])
    }
  });
  if (!bl[0]) return false;
  // dealing with 'Quoi ?' filter
  if (types["all"]) bl[1] = true;
  else if (!bl[1]) {
    Object.keys(types).map((key) => {
      if (key !== "all" && !bl[1] && types[key] && event.type.id == key)
        bl[1] = true;
    });
  }
  if (!bl[1]) return false;
  // dealing with 'Qui ?' filter
  if (artist["id"] === -1) bl[2] = true;
  if (!bl[2] && artist["id"] == event.performer.id) bl[2] = true;
  if (!bl[2]) return false;
  return true;
}
