var map3000;
var directionsDisplay3000;
var directionsService3000 = new google.maps.DirectionsService();
var autocomplete3000;
var startAddress3000;
 
 
function printMap() {
	var cnt =  document.getElementById('directions-panel').innerHTML;
	if (cnt!="") {
		var win = window.open();
		win.document.write(cnt);
	 
		 
	}
}
 
function resizeMap1() {
	 	var myMap = document.getElementById('map-canvas3000');
     	var btnResize = document.getElementById('btnResize');
     	var rightColumnDiv = document.getElementById('rightColumnDiv');
 
     	if(fsmode=="fullscreen") {
			 
 			myMap.style.top = "0";
			myMap.style.left = "0";
			myMap.style.position = "fixed";
			myMap.style.height = "100%";
			myMap.style.width = "100%";
			 google.maps.event.trigger(map3000, 'resize');
			rightColumnDiv.style.right = "0";
			rightColumnDiv.style.top = "0";
			 
			rightColumnDiv.style.position = "fixed";
			
		 
			fsmode = "normal view";
			btnResize.src=img2;
			 map3000.setCenter(new google.maps.LatLng(lat3000,lng3000));
     	} else {
 	 
			btnResize.src=img1;
			myMap.style.top = "";
			myMap.style.left = "";
			myMap.style.paddingBottom = "26.25%";
			myMap.style.overflow = "hidden";
			myMap.style.position = "relative";
			myMap.style.height = "400px";
			myMap.style.width = "100%";
			 
			rightColumnDiv.style.right = "";
			rightColumnDiv.style.top = "";
			 
			rightColumnDiv.style.position = "absolute";
			google.maps.event.trigger(map3000, 'resize');
			fsmode = "fullscreen";
			 map3000.setCenter(new google.maps.LatLng(lat3000,lng3000));
     	}
   
            
   	 
	 
	} 
  
 
function GetLocation3000(location) {
 
    
    var geocoder  = new google.maps.Geocoder();             // create a geocoder object
	var location  = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);    // turn coordinates into an object          
	geocoder.geocode({'latLng': location}, function (results, status) {
	 
		if(status == google.maps.GeocoderStatus.OK) {           // if geocode success
			//startAddress =results[0].formatted_address;         // if address found, pass to processing function
		 	 var components = results[0].address_components;
			
			for (var i = 0, component; component = components[i]; i++) {
				 
				if (component.types[0] == 'locality') {
					startAddress3000 = component['long_name'];
				}
			}
			 
		 	 createCookie3000("wpgadpf_start_address",startAddress3000,365); 
		 	 
			document.getElementById('pac-input-start').value = startAddress3000;
			calcRoute3000("driving");
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
    createCookie3000(name,"",-1);
}


function initialize3000() {
	 
	startAddress3000 = readCookie3000("wpgadpf_start_address"); 
 
	if (startAddress3000==null) {
	 
		 navigator.geolocation.getCurrentPosition(GetLocation3000);
		 
		 
	}  else {
		startAddress3000 = readCookie3000("wpgadpf_start_address");
		document.getElementById('pac-input-start').value = startAddress3000;
	 
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
	var mapOptions = {
    	zoom: 7,
  		scrollwheel: false,
    	center: new google.maps.LatLng(lat3000, lng3000)
  	};
 	  map3000 = new google.maps.Map(document.getElementById('map-canvas3000'),
      mapOptions);
   	var input = document.getElementById('pac-input-start');

	var types = document.getElementById('type-selector');
	
	map3000.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('btnResize'));
	map3000.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('btnPrint'));
	map3000.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('btnWalking'));
	map3000.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('btnDriving'));
	map3000.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	 
	var autocomplete3000 = new google.maps.places.Autocomplete(input);
	autocomplete3000.bindTo('bounds', map3000);


  	directionsDisplay3000 = new google.maps.DirectionsRenderer();
   
  
  	directionsDisplay3000.setMap(map3000);
  	directionsDisplay3000.setPanel(document.getElementById('directions-panel'));

   
 
  	
  	google.maps.event.addListener(autocomplete3000, 'place_changed', function() {
  		calcRoute3000("driving");
  	
  	});
  	if (document.getElementById('pac-input-start').value!="") {
  		calcRoute3000("driving");
  	}
}

function calcRoute3000(typeC) {
  var tm = google.maps.TravelMode.DRIVING;
  if (typeC=="walking") {
  	tm = google.maps.TravelMode.WALKING;
  } 	
  var start = document.getElementById('pac-input-start').value;
 
  var end = address3000;
  var request = {
    origin: start,
    destination: end,
    travelMode: tm
  };
  directionsService3000.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay3000.setDirections(response);
    }
  });
    document.getElementById('spanStartLocation').innerHTML = start;
}

google.maps.event.addDomListener(window, 'load', initialize3000);