  function initialize() {

    // Create the map 
    // No need to specify zoom and center as we fit the map further down.
    var map = new google.maps.Map(document.getElementById("map_canvas"), {
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      streetViewControl: false
    });
 
    // Create the shared infowindow with two DIV placeholders
    // One for a text string, the other for the StreetView panorama.
    var content = document.createElement("DIV");
    var title = document.createElement("DIV");
	content.appendChild(title);
	title.style.color ="gray";
	title.style.height = "30px";
    var streetview = document.createElement("DIV");
    content.appendChild(streetview);
	streetview.style.width = "260px";
    streetview.style.height = "160px";
	streetview.style.background ="red";
	var aqui = document.createElement("DIV");
    content.appendChild(aqui);
	aqui.style.color ="gray";
	aqui.style.height = "30px";
    var infowindow = new google.maps.InfoWindow({
      content: content
    });

    

    // Define the list of markers.
    // This could be generated server-side with a script creating the array.
    var markers = [
	{ lat: 32.45203972483433, lng: -114.7585916519165, name: "Fetasa", icon: "hardware.png" },
	{ lat: 32.469617508861624, lng: -114.78944778442383, name: "Madereria Rio Colorado", icon: "hardware.png" },
	{ lat: 32.47162243013854, lng: -114.77884232997894, name: "Hospital Santa Margarita", icon: "salud.png"  },
	{ lat: 32.474826590862826, lng: -114.76272761821747, name: "Prologo Web Agency", icon: "punto.png"}
    ];

    // Create the markers
    for (index in markers) addMarker(markers[index]);
    function addMarker(data) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.lng),
		icon: data.icon,
        map: map,
        title: data.name
      });
      google.maps.event.addListener(marker, "click", function() {
        openInfoWindow(marker);
      });
    }

    // Zoom and center the map to fit the markers
    // This logic could be conbined with the marker creation.
    // Just keeping it separate for code clarity.
    var bounds = new google.maps.LatLngBounds();
    for (index in markers) {
      var data = markers[index];
      bounds.extend(new google.maps.LatLng(data.lat, data.lng));
    }
    map.fitBounds(bounds);

    // Handle the DOM ready event to create the StreetView panorama
    // as it can only be created once the DIV inside the infowindow is loaded in the DOM.
    var panorama = null;
    var pin = new google.maps.MVCObject();
    google.maps.event.addListenerOnce(infowindow, "domready", function() {
      panorama = new google.maps.StreetViewPanorama(streetview, {
          navigationControl: false,
          enableCloseButton: false,
          addressControl: true,
          linksControl: false,
          visible: true
      });
      panorama.bindTo("position", pin);
    });

    // Create a StreetViewService to be able to check
    // if a given LatLng has a corresponding panorama.
    var service = new google.maps.StreetViewService();
    
    // Set the infowindow content and display it on marker click.
    // Use a 'pin' MVCObject as the order of the domready and marker click events is not garanteed.
    function openInfoWindow(marker) {
      title.innerHTML = marker.getTitle();
      streetview.style['visibility'] = 'hidden';
      service.getPanoramaByLocation(marker.getPosition(), 50, function(result, status) {
        if (status == google.maps.StreetViewStatus.OK) {
          pin.set("position", marker.getPosition());
          streetview.style['visibility'] = '';
        }
      })
      infowindow.open(map, marker);
    }
  }