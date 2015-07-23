var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var autocomplete3000;
var startAddress;
 
function GetLocation3000(location) {
 
    
    var geocoder  = new google.maps.Geocoder();             // create a geocoder object
	var location  = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);    // turn coordinates into an object          
	geocoder.geocode({'latLng': location}, function (results, status) {
		if(status == google.maps.GeocoderStatus.OK) {           // if geocode success
			//startAddress =results[0].formatted_address;         // if address found, pass to processing function
		 	 var components = results[0].address_components;
			 
			for (var i = 0, component; component = components[i]; i++) {
				 
				if (component.types[0] == 'locality') {
					startAddress = component['long_name'];
				}
			}
		 	 createCookie("wpgadpf_start_address",startAddress,365); 
			document.getElementById('pac-input-start').value = startAddress;
			calcRoute();
		}
	});	 
	
	return null;
}

function createCookie3000(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie3000(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie3000(name) {
    createCookie(name,"",-1);
}


function initialize() {
	 
	startAddress = readCookie3000("wpgadpf_start_address"); 
	if (startAddress==null) {
	 
		 navigator.geolocation.getCurrentPosition(GetLocation3000);
		 
		 
	}  else {
		startAddress = readCookie3000("wpgadpf_start_address");
		document.getElementById('pac-input-start').value = startAddress;
	 
	} 

	var geocoder = new google.maps.Geocoder();
  
 	geocoder.geocode({ 'address': address3000 }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    lat3000 = results[0].geometry.location.lat();
                     lng3000 = results[0].geometry.location.lng();
 					 
                } else {
                    alert("Request failed.")
                }
            });

 	var map3000 = new google.maps.Map(document.getElementById('map-canvas3000'),
      mapOptions);
   	var input = document.getElementById('pac-input-start');

	var types = document.getElementById('type-selector');
	map3000.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	
	var autocomplete3000 = new google.maps.places.Autocomplete(input);
	autocomplete3000.bindTo('bounds', map3000);


  	directionsDisplay = new google.maps.DirectionsRenderer();
  	var mapOptions = {
    	zoom: 7,
    	center: new google.maps.LatLng(lat3000, lng3000)
  	};
  
  	directionsDisplay.setMap(map3000);
  	directionsDisplay.setPanel(document.getElementById('directions-panel'));

   
 
  	
  	google.maps.event.addListener(autocomplete3000, 'place_changed', function() {
  		calcRoute();
  	
  	});
  	if (document.getElementById('pac-input-start').value!="") {
  		calcRoute();
  	}
}

function calcRoute() {
  var start = document.getElementById('pac-input-start').value;
 
  var end = address3000;
  var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
    document.getElementById('spanStartLocation').innerHTML = start;
}

google.maps.event.addDomListener(window, 'load', initialize);