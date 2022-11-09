<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false">
</script>
<script type="text/javascript">
// VARIABLES GLOBALES JAVASCRIPT
var geocoder;
var marker;
var latLng;
var latLng2;
var map;

// INICiALIZACION DE MAPA
function initialize() {
  geocoder = new google.maps.Geocoder();	
  latLng = new google.maps.LatLng(3.4516467 ,-76.5319854);
  map = new google.maps.Map(document.getElementById('mapCanvas'), {
    zoom:12,
    center: latLng,
    mapTypeId: google.maps.MapTypeId.HYBRID  });


// CREACION DEL MARCADOR  
    marker = new google.maps.Marker({
    position: latLng,
    title: 'Arrastra el marcador si quieres moverlo',
    map: map,
    draggable: true
  });
  
// Escucho el CLICK sobre el mama y si se produce actualizo la posicion del marcador 
     google.maps.event.addListener(map, 'click', function(event) {
     updateMarker(event.latLng);
   });
  
  // Inicializo los datos del marcador
  //    updateMarkerPosition(latLng);
     
      geocodePosition(latLng);
 
  // Permito los eventos drag/drop sobre el marcador
  google.maps.event.addListener(marker, 'dragstart', function() {
    updateMarkerAddress('Arrastrando...');
  });
 
  google.maps.event.addListener(marker, 'drag', function() {
    updateMarkerStatus('Arrastrando...');
    updateMarkerPosition(marker.getPosition());
  });
 
  google.maps.event.addListener(marker, 'dragend', function() {
    updateMarkerStatus('Arrastre finalizado');
    geocodePosition(marker.getPosition());
  });
  

 
}


// Permito la gesti¢n de los eventos DOM
google.maps.event.addDomListener(window, 'load', initialize);

// ESTA FUNCION OBTIENE LA DIRECCION A PARTIR DE LAS COORDENADAS POS
function geocodePosition(pos) {
  geocoder.geocode({
    latLng: pos
  }, function(responses) {
    if (responses && responses.length > 0) {
      updateMarkerAddress(responses[0].formatted_address);
    } else {
      updateMarkerAddress('No puedo encontrar esta direccion.');
    }
  });
}

// OBTIENE LA DIRECCION A PARTIR DEL LAT y LON DEL FORMULARIO
function codeLatLon() { 
      str= document.form_mapa.longitud.value+" , "+document.form_mapa.latitud.value;
      latLng2 = new google.maps.LatLng(document.form_mapa.latitud.value ,document.form_mapa.longitud.value);
      marker.setPosition(latLng2);
      map.setCenter(latLng2);
      geocodePosition (latLng2);
      // document.form_mapa.direccion.value = str+" OK";
}

// OBTIENE LAS COORDENADAS DESDE lA DIRECCION EN LA CAJA DEL FORMULARIO
function codeAddress() {
        var address = document.form_mapa.direccion.value;
          geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
             updateMarkerPosition(results[0].geometry.location);
             marker.setPosition(results[0].geometry.location);
             map.setCenter(results[0].geometry.location);
           } else {
            alert('ERROR : ' + status);
          }
        });
      }

// OBTIENE LAS COORDENADAS DESDE lA DIRECCION EN LA CAJA DEL FORMULARIO
function codeAddress2 (address) {
          
          geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
             updateMarkerPosition(results[0].geometry.location);
             marker.setPosition(results[0].geometry.location);
             map.setCenter(results[0].geometry.location);
             document.form_mapa.direccion.value = address;
           } else {
            alert('ERROR : ' + status);
          }
        });
      }

function updateMarkerStatus(str) {
  document.form_mapa.direccion.value = str;
}

// RECUPERO LOS DATOS LON LAT Y DIRECCION Y LOS PONGO EN EL FORMULARIO
function updateMarkerPosition (latLng) {
  document.form_mapa.longitud.value =latLng.lng();
  document.form_mapa.latitud.value = latLng.lat();
}

function updateMarkerAddress(str) {
  document.form_mapa.direccion.value = str;
}

// ACTUALIZO LA POSICION DEL MARCADOR
function updateMarker(location) {
        marker.setPosition(location);
        updateMarkerPosition(location);
        geocodePosition(location);
      }

</script>

</script>
</head>
<body   >
  <style>
  #mapCanvas {
    width: 1000px;
    height: 500px;
    float: center;
  } 
  </style>

<div id="formulario">
  <center>

  <form name="form_mapa" method="POST" enctype="multipart/form-data">
       <table>
        <tr>
        <td><p style="font-size: 10px;font-family: verdana;font-weight: bold;">
  	   Dir:&nbsp;<input type="text" name="direccion" id="direccion" value="" style="width: 250px;font-size: 10px;font-family: verdana;font-weight: bold;" />
  	   &nbsp;&nbsp;<input type="button" value="Geo->Dir" onclick="codeAddress()">
  	</p>
  	</td>
	<td><p style="font-size: 10px;font-family: verdana;font-weight: bold;">
	    &nbsp;&nbsp;||&nbsp;&nbsp;Lat:&nbsp;<input type="text" name="latitud" value="41.4235091" style="width: 100px;font-size: 10px;font-family: verdana;font-weight: bold;" />	    
	</p>
	</td>
	<td> <p style="font-size: 10px;font-family: verdana;font-weight: bold;">
	   Lon:&nbsp; <input type="text" name="longitud" value="-0.49647219999997105" style="width: 100px;font-size: 10px;font-family: verdana;font-weight: bold;" />	
	   &nbsp;&nbsp;<input type="button" value="Geo->LatLon" onclick="codeLatLon()"> 
	</p>
	</td>
	<td>	   
	  &nbsp;&nbsp;||&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input type="submit" name="Procesar" onclick = "this.form.action = 'mapas_marcador_procesa.php'" value="Procesar" />	   
	</td>	
	</tr>
     </table> 
     </form>
	 <div id="mapCanvas" align="center"></div>
   </center>       
</div> 
</body>
</html>