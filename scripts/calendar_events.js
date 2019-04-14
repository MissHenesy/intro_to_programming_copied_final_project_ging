/*****************************************************************************/
/* GLOBAL CONSTANTS / VARIABLES
/*****************************************************************************/
const API_SEATGEEK_URL = `https://api.seatgeek.com/2/events?client_id=${API_KEY_SEATGEEK}`;
const API_TICKETMASTER_URL = "https://app.ticketmaster.com/discovery/v2/" +
                             "events.json?size=10&" +
                             "apikey=" + API_KEY_TICKETMASTER;
let savedEvents = new Array();
let listsummed = new Array();
/*****************************************************************************/
/* CALENDAR FUNCTIONS
/*****************************************************************************/
//EVENT CLASS PROTOTYPE
class Event
{
  constructor(title, url, datetime, venue_name,
              venue_address1, venue_address2, venue_city,
              venue_region, venue_postal_code, venue_country, venue_url)
  {
    this._title = title;
    this._url = url;
    this._datetime = datetime;
    this._venue_name = venue_name;
    this._venue_address1 = venue_address1;
    this._venue_address2 = venue_address2;
    this._venue_city = venue_city;
    this._venue_region = venue_region;
    this._venue_postal_code = venue_postal_code;
    this._venue_country = venue_country;
    this._venue_url = venue_url;
  }
  title()
  {
    return this._title;
  }
  url()
  {
    return this._url;
  }
  datetime()
  {
    return this._datetime;
  }
  venue()
  {
    let arr_result = [
      ["venue_name", this._venue_name],
      ["venue_address1", this._venue_address1],
      ["venue_address2", this._venue_address2],
      ["venue_city", this._venue_city],
      ["venue_region", this._venue_region],
      ["venue_postal_code", this._venue_postal_code],
      ["venue_country", this._venue_country],
      ["venue_url", this._venue_url]
    ];
    return arr_result;
  }
  getVenueItem(item_name)
  {
    let result = "";
    for (let i of this.venue())
    {
      if (i[0] === item_name)
      {
        result = i[1] || "";
        break;
      }
    }
    return result;
  }
}
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
$("document").ready(function()
  {
    attachDOMevents();
    loadSavedList();
  }
);
//-----------------------------------------------------------------------------
function attachDOMevents()
{
   // Uncheck all radio buttons
  $("input:radio").prop("checked", false);

  // Make sure our date input field shows a calendar for user input
  $("#date_input").datepicker({ minDate: 0 });

  // Hide div_User_Messages whenever user search input changes
  $("#search_input, #date_input").on("keyup keypress change", function(e)
    {
      $("#div_User_Messages").hide();
    }
  );

  // Show/hide objects based on radio button choices
  $("input:radio").change(function()
    {
      $("#div_User_Messages").hide();
      if ($(this).val() === "datetime")
      {
        $("#search_input").hide();
        $("#date_input").val("");
        $("#date_input").show();
      } else {
        $("#search_input").val("");
        $("#search_input").show();
        $("#date_input").hide();
      }
      if ($("#div_Submit_Input").is(":hidden")) $("#div_Submit_Input").show();
    }
  );
}
//-----------------------------------------------------------------------------
function addToMyList(index)
{
  let exists = false;
  if (savedEvents === null) savedEvents = new Array();
  let event = listsummed[index];

  for (let x = 0; x < savedEvents.length; x++)
  {
    if (savedEvents[x]._title === event.title() &&
        savedEvents[x]._datetime === event.datetime() &&
        savedEvents[x]._venue_name === event.getVenueItem("venue_name"))
    {
      exists = true;
    }
  }
  if (!exists)
  {
    savedEvents.push(event);
  }
  window.localStorage.setItem("SavedEvents",JSON.stringify(savedEvents));
  let displaySavedList = "<table><tr><th>Who</th><th>When</th><th>Where</th><th>&nbsp;</th></tr>";
  for (let x = 0; x < savedEvents.length; x++)
  {
    let listItem = `<tr><td><a href="${savedEvents[x]._url}" target="_blank">${savedEvents[x]._title}</a></td>
                    <td>${format_date(savedEvents[x]._datetime, "iso_date_with_human_time")}</td>
                    <td>${savedEvents[x]._venue_name}</td>
                    <td><button onclick="removeFromMyList('${x}')">Remove</button></td></tr>`;
    displaySavedList += listItem;
  }
  displaySavedList += '</table>';
  $("#p_events").html(displaySavedList);
}
//-----------------------------------------------------------------------------
function removeFromMyList(index)
{
  savedEvents.splice(index, 1);
  window.localStorage.setItem("SavedEvents",JSON.stringify(savedEvents));
  var displaySavedList = "<table><tr><th>Who</th><th>When</th><th>Where</th><th>&nbsp;</th></tr>";
  for (var x=0;x<savedEvents.length;x++)
  {
    var listItem = `<tr>
                   <td><a href="${savedEvents[x]._url}" target="_blank">${savedEvents[x]._title}</a></td>
                   <td>${format_date(savedEvents[x]._datetime, "iso_date_with_human_time")}</td>
                   <td>${savedEvents[x]._venue_name}</td>
                   <td><button onclick="removeFromMyList(${x})">Remove</button></td>
                   </tr>`;
    displaySavedList += listItem;
  }
  displaySavedList += "</table>";
  $("#p_events").html(displaySavedList);
}
//-----------------------------------------------------------------------------
function loadSavedList()
{
  savedEvents = JSON.parse(window.localStorage.getItem("SavedEvents"));
  if (savedEvents === null || savedEvents.length === 0)
  {
    $("#p_events").html("You currently have no saved events loaded into the calendar.");
  }
  else
  {
    let displaySavedList = "<table><tr><th>Who</th><th>When</th><th>Where</th><th>&nbsp;</th></tr>";
    for (var x = 0; x < savedEvents.length; x++)
    {
      let listItem = `<tr><td><a href="${savedEvents[x]._url}" target="_blank">${savedEvents[x]._title}</a></td>
                      <td>${format_date(savedEvents[x]._datetime, "iso_date_with_human_time")}</td>
                      <td>${savedEvents[x]._venue_name}</td>
                      <td><button onclick="removeFromMyList('${x}')">
                      Remove</button></td></tr>`;
      displaySavedList += listItem;
    }
    displaySavedList += "</table>";
    $("#p_events").html(displaySavedList);
  }
}
//-----------------------------------------------------------------------------
function validateForm() {
  let search_input = get_search_input();
  let input_type = search_input.val_type;
  let input_val = search_input.val;
  let err_msg = "";

  $("#div_User_Messages").empty().hide();

  if (input_val.length === 0)
  {
    err_msg = "I can't search for nothing!";
  } else if (input_type === "datetime") {
    let input_val = format_date($("#date_input").val().trim());
    if (!input_val)
    {
      err_msg = "Invalid Date";
    }
  }

  if (err_msg.length > 0)
  {
    $("#div_User_Messages").html(err_msg).show();
    return false;
  } else {
    clearResults();
    await_getAllEvents(input_type, input_val)
      .then(displayEvents)
      .catch(err => { err_handler(err) });
  }
}
//-----------------------------------------------------------------------------
//function to erase the search history and clear the page.
function clearResults()
{
  displayList = new Array();
  $("#div_Event_Search_Results").empty();
  $("#div_No_Results_Found").empty();
  $("#div_Artist_Pic").empty();
  $("#div_Total_Return").empty();
  if (seatGeekResults.listsg) seatGeekResults.listsg.length = 0;
  if (ticketMasterResults.listtm) ticketMasterResults.listtm.length = 0;
  if (listsummed) listsummed.length = 0;
}
//-----------------------------------------------------------------------------
async function await_getAllEvents(input_type, input_val)
{
    try
    {
      let promises = [];
      let p1 = seatGeekResults(input_type, input_val);
      let p2 = ticketMasterResults(input_type, input_val);

      promises.push(p1,p2);
      result = await Promise.all(promises)
                            .catch((err) => err_handler(err));
      return result;
    }
    catch(err)
    {
      err_handler(err);
    }
}
//-----------------------------------------------------------------------------
function seatGeekResults(input_type, input_val)
{
  // Seatgeek API collector script, which is used by the API collector
  // to create event objects using the Event class.
  seatGeekResults.listsg = new Array();
  let qtypesg = `${input_type}`;
  let q_input = `${input_val.replace(" ", "-")}`;
  let api_url = API_SEATGEEK_URL;

  switch(input_type)
  {
    case "performers":
      qtypesg = "performers.slug";
      break;
    case "venue":
      // Do nothing, at the moment... having some trouble finding out how
      // to generate an all-purpose query for SeatGeek to get events tied
      // to venues. It's a bit complicated and will require thinking about
      // what options we want to give to the user. We'll rely on Ticketmaster
      // results for now.
      return false;
      break;
    case "datetime":
      //qtypesg = "datetime_utc.gt";
      qtypesg = "datetime_local.gt";
      q_input = format_date(input_val);
      break;
  }
  api_url += `&${qtypesg}=${q_input}`;

  // SEATGEEK API URL::
  // console.log(api_url);
  return new Promise((resolve, reject) => {
    $.ajax({
      url: api_url,
      method: "GET",
      success: function(json)
        {
          let shows = getEventDetails("seatgeek", json.events);
          if (shows)
          {
            seatGeekResults.listsg.push(shows);
            seatGeekResults.listsg = [].concat.apply([], seatGeekResults.listsg);
          }
          resolve(seatGeekResults.listsg);
        },
      error: reject
    });
  });
}
//-----------------------------------------------------------------------------
function ticketMasterResults(input_type, input_val)
{
  // ticketmaster API collector, which is used by the API collector
  // to create event objects using the event class.
  ticketMasterResults.listtm = new Array();
  input_val = encodeURI(input_val);
  let qtypetm = "keyword",
      sort = "&sort=date,name,asc",
      api_url = API_TICKETMASTER_URL;

  switch(input_type)
  {
    case "venue":
      api_url.replace("events","venues");
      break;
    case "datetime":
      qtypetm = "startDateTime";
      input_val = format_date(input_val, "iso_datetime_tz0");
      break;
  }
  // TICKETMASTER API URL::
  // console.log(`${api_url}&${qtypetm}=${input_val}${sort}`)
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: `${api_url}&${qtypetm}=${input_val}${sort}`,
      dataType: "json",
      success: function(json) {
        if (json._embedded && json._embedded.events)
        {
          let shows = getEventDetails("ticketmaster", json._embedded.events);
          if (shows)
          {
            ticketMasterResults.listtm.push(shows);
            ticketMasterResults.listtm = [].concat.apply([], ticketMasterResults.listtm);
          }
        }
        resolve(ticketMasterResults.listtm);
      },
      error: reject
    });
  });
}
//-----------------------------------------------------------------------------
function getEventDetails(api_name, json)
{
  try
  {
    if (!json || json.length === 0)
    {
      return null;
    }

    let shows = new Array(),
        title, url, datetime, events,
        venues, venue_name, venue_address1, venue_address2,
        venue_city, venue_region, venue_postal_code, venue_country,
        venue_url, artist_photo;

        for (let x = 0; x < json.length; x++)
        {
          title = null;
          url = null;
          datetime = null;
          events = null;
          venues = null;
          venue_name = null;
          venue_address1 = null;
          venue_address2 = null;
          venue_city = null;
          venue_region = null;
          venue_postal_code = null;
          venue_country = null;
          venue_url = null;

          switch(api_name)
          {
            case "seatgeek":
              events = json[x];
              title = events.title;
              url = events.url;
              if (events.time_tbd)
              {
                // The start time is "TBD", so use format_date function
                // to return the date without the time... otherwise the
                // event will appear to start at 3:30am, the "sentinel time"
                // used by SeatGeek whenever times are not yet set. (See
                // SeatGeek API documentation for more info.)
                datetime = format_date(events.datetime_local);
              } else {
                // We have a date and a time, huzzah
                datetime = events.datetime_local;
              }
              if (events.venue)
              {
                venues = events.venue;
                venue_name = venues.name;
                venue_address1 = venues.address;
                venue_address2 = null;
                venue_city = venues.city;
                venue_region = venues.state;
                venue_postal_code = venues.postal_code;
                venue_country = venues.country;
                venue_url = venues.url;
               }
              break;
            case "ticketmaster":
              events = json[x];
              title = events.name;
              url = events.url;
              if (events.dates.start.timeTBA)
              {
                datetime = events.dates.start.localDate;
              } else {
                if (events.dates.start.localDate) datetime = events.dates.start.localDate;
                if (events.dates.start.localTime) datetime += `T${events.dates.start.localTime}`;
              }
              if (events._embedded && events._embedded.venues)
              {
                venues = events._embedded.venues[0];
                venue_name = venues.name;
                if (venues.address) venue_address1 = venues.address.line1;
                if (venues.address) venue_address2 = venues.address.line2;
                if (venues.city) venue_city = venues.city.name;
                if (venues.state) venue_region = venues.state.stateCode;
                if (venues.postalCode) venue_postal_code = venues.postalCode;
                if (venues.country) venue_country = venues.country.countryCode;
                venue_url = venues.url;
              }
              break;
          }
          shows.push(new Event(title, url, datetime, venue_name, venue_address1,
                               venue_address2, venue_city, venue_region,
                               venue_postal_code, venue_country, venue_url));
        }
        if (api_name === "seatgeek" &&
           json[0].performers &&
           json[0].performers[0].image)
        {
          artist_photo = `<img src="${json[0].performers[0].image}" />`;
          $("#div_Artist_Pic").html(artist_photo);
        }
        return shows;
  }
  catch (err)
  {
    err_handler(err);
  }
}
//-----------------------------------------------------------------------------
function displayEvents()
{
  try
  {
    listsummed = seatGeekResults.listsg.concat(ticketMasterResults.listtm);

    if (listsummed.length > 0)
    {
      listsummed.sort(array_sorter("asc", "_datetime", "_title"));
      $("#div_Total_Return").html(`There are ${listsummed.length} events in your search.`);

      let displayList = `<table><tr>
                         <th>Who</th>
                         <th>When</th>
                         <th>Venue Name</th>
                         <th>Venue City</th>
                         <th>Venue Region</th>
                         <th>Venue Country</th>
                         <th>&nbsp;</th></tr>`;
      for (let x = 0; x < listsummed.length; x++)
      {
        let listItem = `<tr><td><a href="${listsummed[x].url()})" target="_blank">${listsummed[x].title()}</a></td>
                       <td>${format_date(listsummed[x].datetime(), "iso_date_with_human_time")}</td>
                       <td>${listsummed[x].getVenueItem("venue_name")}</td>
                       <td>${listsummed[x].getVenueItem("venue_city")}</td>
                       <td>${listsummed[x].getVenueItem("venue_region")}</td>
                       <td>${listsummed[x].getVenueItem("venue_country")}</td>
                       <td><button id="btn_AddToList" onclick="addToMyList(${x})">
                       Add to My List</button></td></tr>`;
        displayList += listItem;
      }
      displayList += "</table>";
      $("#div_Event_Search_Results").html(displayList).show();
      $("#div_No_Results_Found").hide();
      $("#div_Results_Found").show();
    } else {
      let search_input = get_search_input();
      let displayText = `<h3>No results found for ${search_input.val}</h3>`;
      $("#div_Results_Found").hide();
      $("#div_No_Results_Found").html(displayText).show();
    }
    $("#div_Search_Results").show();
  }
  catch (err)
  {
    err_handler(err);
  }
}
//-----------------------------------------------------------------------------
// HELPER FUNCTIONS
//-----------------------------------------------------------------------------
function compareListsA()
{
  var y
  var x = 0
  for (var x = 0;  y < listtm.length; x++){
    if (seatGeekResults.listsg[x]._artist == ticketMasterResults.listtm[y]._artist && seatGeekResults.listsg[x]._date == ticketMasterResults.listtm[y]._date) {delete seatGeekResults.listsg[x]};
    if (x >= seatGeekResults.listsg.length) {y++, x=0};
  }
}
//-----------------------------------------------------------------------------
function compareListsB()
{
  var y
  var x = 0
  for (var x =0; y < seatGeekResults.listsg.length; x++){
    if (ticketMasterResults.listtm[x].artist == seatGeekResults.listsg[y].artist && ticketMasterResults.listtm[x].date == seatGeekResults.listsg[y]) {delete ticketMasterResults.listtm[x]};
    if (x>=listtm.length) {y++, x=0};
  }
}
//-----------------------------------------------------------------------------
function get_search_input()
{
  let val = null;
  let val_type = $("input:radio:checked").val();

  if (val_type === "datetime")
  {
    val = $("#date_input").val().trim();
  } else  {
    val = $("#search_input").val().trim();
  }

  return { val, val_type }
}
//-----------------------------------------------------------------------------
function format_date(date_val, format_type="")
{
  if (!isDate(date_val))
  {
    return null;
  }
  let month_names = ["January", "February", "March", "April", "May", "June",
                     "July", "August", "September", "October", "November",
                     "December"];

  let dt = date_val;
  if (date_val.indexOf("/") > 0)
  {
    dt = date_val.replace(/(..).(..).(....)/, "$3-$1-$2");
  }
  let date_parts = dt.split(/[^\d]/);
  let yyyy = date_parts[0];
  let mm = date_parts[1];
  let dd = date_parts[2];
  let time = null;
  let result = null;

  // For a listing of ISO formats and their names, see::
  // http://support.sas.com/documentation/cdl/en/lrdict/64316/HTML/default/viewer.htm#a003169814.htm
  switch(format_type)
  {
    case "iso_datetime":
      result = `${yyyy}-${mm}-${dd}T00:00:00`;
      break;
    case "iso_datetime_tz0":
      // NOTE: Setting default time to 0 can produce unpredictable results,
      // so we will set the time to 11:00PM for a more reliable result,
      // but obviously we should revisit this when it is time to filter
      // results to something more precise
      result = `${yyyy}-${mm}-${dd}T23:00:00Z`;
      break;
    case "date":
      result = month_names[parseInt(mm)-1] + " " + dd + ", " + yyyy;
      break;
    case "iso_date_with_human_time":
      let t = "";
      if (date_parts.length === 6)
      {
        let time = date_parts;
        t = `${time[3]}:${time[4]}:${time[5]}`;
        t = format_time(t);
      }
      result = `${yyyy}-${mm}-${dd} ${t}`;
      break;
    default:
      result = `${yyyy}-${mm}-${dd}`;
  }
  return result;
}
//-----------------------------------------------------------------------------
function format_time(time_val)
{
  let time_parts = time_val.split(":");
  let hh = time_parts[0];
  let h = hh;
  let meridian = "AM";

  if (hh >= 12)
  {
    h = hh - 12;
    meridian = "PM";
  }
  if (h === 0)
  {
    h = 12;
  }

  let result = h + ":" + time_parts[1] + " " + meridian;

  return result;
}
//-----------------------------------------------------------------------------
function err_handler(err=null, err_jxhr=null, err_text="", err_thrown="")
{
  if (err_jxhr)
  {
    console.error(`Status: ${err_jxhr.status}`);
    console.error(`Response Text: ${err_jxhr.responseText}`);
    console.error(`Error Thrown: ${err_thrown}`);
    console.error(`Error Text: ${err_text}`);
    console.error(err_jxhr);
  }
  if (err)
  {
    if (err.responseText)
    {
      console.error(`Status: ${err.status}`);
      console.error(`Response Text: ${err.responseText}`);
    }
    console.error(err);
  }
}
//-----------------------------------------------------------------------------
function isDate(val)
{
  let test_date = new Date(val);

  if (Object.prototype.toString.call(test_date) === "[object Date]")
  {
    return true;
  } else {
    return false;
  }
}
//-----------------------------------------------------------------------------
function array_sorter(order="asc", prop1, prop2="")
{
  return function(a, b)
  {
    if (!a.hasOwnProperty(prop1) || !b.hasOwnProperty(prop1)) return 0;
    if (prop2.length > 1)
    {
      if (a[prop1] > b[prop1]) return 1;
      if (a[prop1] < b[prop1]) return -1;
      if (a[prop2] > b[prop2]) return 1;
      if (a[prop2] < b[prop2]) return -1;
      return 0;
    } else {
      let comparison = a[prop1].localeCompare(b[prop1]);
      return ( (order === "desc") ? (comparison * -1) : comparison );
    }
  }
}
//-----------------------------------------------------------------------------
function trim_last_char(str_input)
{
  let result = str_input.trim().substring(0, str_input.length - 1);
  return result;
}
//-----------------------------------------------------------------------------
