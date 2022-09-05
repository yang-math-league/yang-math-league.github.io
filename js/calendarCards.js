var Root = 'https://www.googleapis.com/calendar/v3/calendars/';
var calendarID = 'westernpaarml@gmail.com';
var maxResults = 3;
var APIKey = 'AIzaSyBHIh0EFUSPss_CQrdDYlDmun23OJdsXBA';
var currectDate = (new Date()).toISOString();
var EventsDiv = document.getElementById("EventCards");

$(document).ready(function () {
    $.ajax({
      url: Root + calendarID + "/events?maxResults=" + maxResults + "&timeMin=" + currectDate + "&singleEvents=true&orderBy=startTime" + '&key=' + APIKey,
      method: 'GET'
    }).then(function(data) {
        var items = data.items;
        numberOfEvents = items.length;
        for(var i = 0; i < items.length; i++) {

            var startTime = getDateTime(items[i].start);
            var endTime = getDateTime(items[i].end);

            var card = `
                <li class="card">
                    <div class="card--text">
                        <div class="text--container">
                            <div class="text--header">
                                <a class="addEvent-btn" href="${items[i].htmlLink}" target="_blank"><i class="fas fa-calendar-plus"></i></a>
                                <h2 class="text--title">` + items[i].summary + `</h2>
                                    `+ getEventLocation(items[i]) + `
                                    <p>` + getEventDate(startTime) + `</p>
                                    <p>` + getEventTime(startTime, items[i].start) + getEventEndTime(endTime, items[i].end) + `</p>
                                    ` + getEventDisc(items[i].description) + `
                                </div>
                            </div>
                        </div>
                    <div id="_canvas${i}" class="map_canvas"></div>
                </li>`;
            EventsDiv.innerHTML += card;
        }
		<!--
        for(var i = 0; i < data.items.length; i++){
            if(data.items[i].location != null){
                mapInitilization(data.items[i].location, [i]);
            }
        } 
		-->
        EventsDiv.style.width = `${370*data.items.length}px`;
    });
});

$( window ).resize(function() {
    $( "#log" ).append( "<div>Handler for .resize() called.</div>" );
});

function  getEventLocation(evntLocation) {
    if(evntLocation.location){
        return  `<p><i class="fas fa-map-marker-alt"></i> ` + evntLocation.location + `</p>`
    } else {
        return '';
    }
}

function  getEventDisc(disc) {
    if(disc == null){
        return "";
    } else 
    return disc;
}

function  getEventDate(date) {
    var length = (date.toUTCString().length - 13);
    return `<i class="far fa-calendar-alt"></i> ` + date.toUTCString().substring(0, length);
}

function getDateTime(event) {
    if(event.date != null) {
        return date = new Date(event.date);
    } else {
        return new Date(event.dateTime);
    }
}

function  getEventTime(time, event) {
    var length = (time.toLocaleTimeString().length);
    if(event.date != null) {
        return `<i class="far fa-clock"></i> All day`; 
    }
    return `<i class="far fa-clock"></i> ` + time.toLocaleTimeString().substring(0, length - 6) + time.toLocaleTimeString().substring(length - 3, length);
}

function  getEventEndTime(time, event) {
    var length = (time.toLocaleTimeString().length);
    if(event.date != null) {
        return ``; 
    }
    return ` - ` + time.toLocaleTimeString().substring(0, length - 6) + time.toLocaleTimeString().substring(length - 3, length);
}

function mapInitilization(location, index) {
    var geocoder, map;
    var address = location;

    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(40.4406, 79.9959);
    var myOptions = {
        zoom: 17,
        center: latlng,
        mapTypeControl: true,
        mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        navigationControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
  
    
    map = new google.maps.Map(document.getElementById(`map_canvas${index}`), myOptions);

    if (geocoder) {
      geocoder.geocode({
        'address': location
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
             map.setCenter(results[0].geometry.location); 
            var marker = new google.maps.Marker({
            position: results[0].geometry.location,
            map: map,
            title: address
            });
            $(`#map_canvas${index}`).addClass("map-init");
            google.maps.event.addListener(marker, 'click', function() {
              infowindow.open(map, marker);
            });
  
        } else {
            document.getElementById(`map_canvas${index}`).style.visibility='hidden';
        }
      });
    }  
  }  