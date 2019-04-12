# intro_to_programming_copied_final_project_ging
Per Assignment 12 of Intro to Programming for Musicians, this is a copy of a classmate's project. My goal is to try to refactor/improve/add features of/to this repo.

**HOW TO VIEW THE SITE**

To get the full experience of the site, download the repo into a local directory on your computer, and then launch "index.html" into a browser.
*NOTE: You will need to acquire your own API Keys in order to see the API data that is pulled into the site.*

**CHANGES MADE TO THE PROJECT**
* Fixed known issues
  - Added a div that displays when no results are found, letting user know their search was unsuccessful
  - Results no longer stack on top of each other. Each new search will replace the results that were there before.
  - Search queries are formatted behind the scenes in the javascript, allowing for graceful querying of both SeatGeek and Ticketmaster APIs
  - Venue searches now return results, albeit only from Ticketmaster. It seems there's no good way to create an all-purpose query that will search SeatGeek to find events tied to venues. It's all a bit complicated, and will require thinking about what options the user might want to choose when attempting to find SeatGeek events by venue.
* Improved/Added features
  - Added some CSS to change the look of the page
  - I've hidden the "Clear Results" button; it doesn't seem necessary now, since new searches will completely replace the results. But, since it might still be a matter of preference as to whether it should appear, it can easily be returned by removing the "class='hidden'" propery on its div container.
  - When the "Date" radio box is selected, a jQuery datepicker is added to the input box, allowing for consistent date input. The date input is then formatted via javascript
  - Search results are sorted by date/time, then by title
  - Separated the code into individual html, css, and javascript files
* Refactored code
  - Beefed up the "Event" class so that it contains more info about venues; also added internal functions to return data so that we do not have to call *_propertyName* (which seems internal to the class). I.E., let my title = *event.title()*, rather than let my_title = *event._title*.
  - Made the calls to SeatGeek and Ticketmaster asynchronous rather than synchronous
  - Uses "Promise.all" function called "await_getAllEvents" to query the APIs
  - "getEventDetails" parses through results sent by both APIs and returns array of event info
  - "ticketMasterResults" and "seatGeekResults" consume info sent to them by "getEventDetails"
  - Finally, "displayEvents" displays the concatenated list of SeatGeek & Ticketmaster info
  - Expanded search results to return 10 records per API
  - Added a few helper functions
  - Many more changes were probably added or completed, but it's hard to remember them all!
