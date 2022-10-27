<meta name="description" content="Cartagena">

<script type="text/javascript" src="http://maps.google.com/maps/api/js?key=AIzaSyCvK5VBQk4wRZ0CNircRSBZZsFjLL3J0Lo">
  </script>


<script type="text/javascript">
  function initMaps() {
    var src = 'http://web.mit.edu/11.944/www/kml/Cartagena.kmz';
          
    var latlng = new google.maps.LatLng(10.4002813, -75.5435451);
    var mapDiv4 = document.getElementById('map_canvas_4');
    var myOptions4 ={
      center: latlng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    var map4 = new google.maps.Map(mapDiv4, myOptions4);
    loadKmlLayer(src, map4);
              
  }
  

  function loadKmlLayer(src, map) {
    var kmlLayer = new google.maps.KmlLayer(src, {
      suppressInfoWindows: false,
      preserveViewport: false,
      map: map
    });
    google.maps.event.addListener(kmlLayer, 'click', function(event) {
      var content = event.featureData.infoWindowHtml;
      var testimonial = document.getElementById('capture');
      testimonial.innerHTML = content;
    });
  }
</script>


</head>
<body onload="initMaps()">
  <h3>Cartagena</h3>
  <div id="map_canvas_4" style="width:100%; height:100%"></div>
</body>
</html>
