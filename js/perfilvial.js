require([
			"esri/Map",
			"esri/views/MapView",
			"esri/widgets/BasemapToggle",
			"esri/layers/FeatureLayer",
			"esri/layers/support/LabelClass",
			"esri/symbols/TextSymbol",
			"esri/widgets/Legend",
			"esri/widgets/Expand",
			"esri/widgets/BasemapGallery",
			"esri/config",
			"esri/request",
			"esri/widgets/Search",
			"esri/widgets/Feature",
			"esri/layers/TileLayer",  // Require the TileLayer module
			"dojo/dom",  // require dojo/dom for getting the DOM element
			"dojo/on",   // require dojo/on for listening to events on the DOM
			"dojo/domReady!"
		], function (Map, MapView, BasemapToggle, FeatureLayer, LabelClass, TextSymbol, Legend, Expand, BasemapGallery, esriConfig, esriRequest, Search, Feature, TileLayer, dom, on) {
			// Create the Map
			var map = new Map({
				basemap: "hybrid"
			});

			var view = new MapView({
				container: "viewDiv",  // Reference to the scene div created in step 5
				map: map,  // Reference to the map object created before the scene
				zoom: 13,  // Sets zoom level based on level of detail (LOD)
				center: [-76.52, 3.435],  // Sets center point of view using
				highlightOptions: {
					color: [255, 241, 58],
					fillOpacity: 0.4
				},
				popup: {
		            dockEnabled: true,
		            dockOptions: {
		              // Disables the dock button from the popup
		              buttonEnabled: false,
		              // Ignore the default sizes that trigger responsive docking
		              breakpoint: false
		            }
		          }
			});
			view.popup.set("featureNavigationEnabled", false);
			/*

			// 1 - Create the widget
			var toggle = new BasemapToggle({
				// 2 - Set properties
				view: view, // view that provides access to the map's 'topo' basemap
				nextBasemap: "hybrid" // allows for toggling to the 'hybrid' basemap
			});

			// Add widget to the top right corner of the view
			view.ui.add(toggle, "bottom-right");

*/
			//crete  search widget
			var predios_urbanos = new FeatureLayer({
			url: "https://geoportal.cali.gov.co/agserver/rest/services/Lineas/predial_idesc/FeatureServer/0",
			title: "predios",
			minScale: 1,
			outFields: ["*"]
			
			});
			var predios_rurales = new FeatureLayer({
				url: "https://geoportal.cali.gov.co/agserver/rest/services/Lineas/predial_idesc/FeatureServer/1",
				title: "predios",
				minScale: 1,
				outFields: ["*"]
				
			});

	        var searchWidget = new Search({
	          view: view,
	          allPlaceholder: "Todos los criterios",
	          sources: [
	            {
	              layer: predios_urbanos,
	              searchFields: ["numepred","npn"],
	              displayField: "numepred",
	              exactMatch: false,
	              outFields: ["*"],
	              name: "Número predial urbano",
	              zoomScale: 100000,
	              placeholder: "F038600080000"
	            },
	            {
	              layer: predios_rurales,
	              name: "Número predial rural",
	              zoomScale: 100000,
	              displayField: "numepred",
	              searchFields: ["numepred", "npn"],
	              exactMatch: false,
	              outFields: ["*"],
	              placeholder: "Y000700820001"
	            }
	          ]
	        });

	        


			//Accion del boton para generar el perfil
			// var ThisAction = {
			// 	title: "Ver perfil",
			// 	id: "draw-this",
			// 	className: "esri-icon-polygon"
			// 	//image: "Measure_Distance16.png"
			// };
			//Accion para visuallizar el street view
// 			var streetview = {
// 				title: "Ver street view",
// 				id: "streetview-this",
// 				// className: "esri-icon-polygon"
// 				image: "https://saul.cali.gov.co/saul2/images/img_lineas/street_view.png"
// 			};
// 			//template o contenido inicial del popup
// 			var template = {
// 				title: "{tipo} {nomenclatu} ",
// 				content: "<a target= blank href='{url}'>Consulta en SAUL</a> <ul>\
//   	<li> <span aria-hidden='true' class='esri-popup__icon esri-icon-polygon'></span> visuallizar el perfil de la via</li>\
//   	<li> <img height='16px' width='13px' src='https://saul.cali.gov.co/saul2/images/img_lineas/street_view.png'/> vista de la via por streetview con el boton </li>\
//   </ul>",
// 				updateLocationEnabled: true,
// 				actions: [ThisAction, streetview]
// 			};

			/*var streetview = {
                title: "Ver street view",
                id: "streetview-this",                
                image: 'https://saul.cali.gov.co/saul2/images/img_lineas/street_view.png'
            };*/

             const labelClass = {
		          // autocasts as new LabelClass()
		          symbol: {
		            type: "text", // autocasts as new TextSymbol()
		            color: "black",
		            haloColor: "GREY",
		            haloSize : "2px",
		            font: {
		              // autocast as new Font()
		              family: "monospace",
		              size: 11,
		              weight: "bold"
		            }
		          },
		          labelPlacement: "above-center",
		          labelExpressionInfo: {
		            expression: "$feature.tipo+'  '+$feature.nomenclatu"
		          }
		        };





			var templatePerfiles = {
                title: "{tipo} {nomenclatu} ",
                content: drawThis,
                updateLocationEnabled: true,
                //Para adicionar el [streetview]
                actions: []
            };

             //template o contenido inicial del popup
			var t_decreto = {
			title: "Decreto 0359 de 2019",
			content: "{text}",
			updateLocationEnabled: true
			};



			// Create a FeatureLayer
			var decreto = new FeatureLayer({
			url: "https://geoportal.cali.gov.co/agserver/rest/services/Lineas/Decreto_0359_2019/MapServer/0",
			title: "Decreto 0359 de 2019",
			opacity: 0.5,
			minScale: 15000,
			outFields: ["*"],
			popupTemplate: t_decreto
			});
			map.add(decreto);

			// Create a FeatureLayer
			var perfiles = new FeatureLayer({
				url: "https://geoportal.cali.gov.co/agserver/rest/services/Lineas/lineas_usuarios/MapServer/0",
				//url: "https://geoportal.cali.gov.co/agserver/rest/services/Lineas/lineas_auto/MapServer/0",
				title: "Perfiles Viales",
				outFields: ["*"],
				labelsVisible: true,
				minScale: 15000,
				labelingInfo: [labelClass],
				popupTemplate: templatePerfiles
			});
			map.add(perfiles);

			var perfiles2 = new FeatureLayer({
				url: "https://geoportal.cali.gov.co/agserver/rest/services/Lineas/lineas_usuarios/MapServer/0",
				//url: "https://geoportal.cali.gov.co/agserver/rest/services/Lineas/lineas_auto/MapServer/0",
				title: "Perfiles Viales",
				outFields: ["*"],
				labelsVisible: true,
				labelingInfo: [labelClass],
				popupTemplate: templatePerfiles
			});
			map.add(perfiles2);


			view.whenLayerView(perfiles)
				.then(function (layerView) {

					// if a feature is already highlighted, then remove the highlight
					if (highlightSelect) {
						highlightSelect.remove();
					}

					// set the highlight on the first feature returned by the query
					highlightSelect = layerView.highlight(feature);
				});


			//leyenda del mapa en un boton expandible
			/*const legendExpand = new Expand({
				view: view,
				content: new Legend({
					view: view,
					style: "card",
					layerInfos: [{
						layer: perfiles,
						title: "NY Educational Attainment"
					}]
				})
			});
			view.ui.add(legendExpand, "top-left");*/

			view.ui.add(searchWidget, {
	          position: "top-left"
	        });

			const legendExpand = new Expand({
				view: view,
				content: new Legend({
					view: view,
					style: "classic"			
				})
			});
			view.ui.add(legendExpand, "top-left"); 

			// Add the search widget to the top left corner of the view
	        
			//permisos para el dominio 
			//esriConfig.request.corsEnabledServers.push("https://saul-dev1.cali.gov.co/");

			function textcontent(id) {
				var url = "https://saul.cali.gov.co/saul2/app_dev.php/perfilvial/" + id;
				esriRequest(url, { responseType: 'json' }).then(function (response) {
					antejardin = JSON.stringify(response.data[0].antejardinIzquierdo, null, 2);
					anden = JSON.stringify(response.data[0].andenIzquierdo, null, 2);
					view.popupTemplate.content = view.popup.selectedFeature.attributes.id;
				});
			};

			function streetviewThis() {

				var lat = view.popup.location.latitude;
				var lng = view.popup.location.longitude;
				view.popup.content = "<iframe width='100%' height='200px' src='streetview.php?lat=" + lat + "&lng=" + lng + "' ></iframe>";
			};

			function drawThis() {			
				var url = "https://saul.cali.gov.co/saul2/app_dev.php/perfilvial/" + view.popup.selectedFeature.attributes.id;
				esriRequest(url, { responseType: 'json' }).then(function (response) {

					var via = JSON.stringify(response.data[0].via, null, 2);
					var calzada = JSON.stringify(response.data[0].calzada, null, 2);

					var separador = JSON.stringify(response.data[0].dimensionSeparador, null, 2);

					var claseVia=JSON.stringify(response.data[0].claseVia.texto,null,2);
					var max=claseVia.length-1;
					var claseVia=claseVia.substring(1,max);

					var urlFuente1 = JSON.stringify(response.data[0].urlFuente1, null, 2);
					var urlFuente2 = JSON.stringify(response.data[0].urlFuente2, null, 2);

					var fuente1 = JSON.stringify(response.data[0].fuente1, null, 2);
					var fuente2 = JSON.stringify(response.data[0].fuente2, null, 2);
					if ((fuente2 == null || fuente2==0)) { fuente2_url = "" } else { var fuente2_url = "<a target= blank href=" + urlFuente2 + " title='Consulta en SAUL'>Fuente 2 </a>"; };


					var antejardinizq = JSON.stringify(response.data[0].izquierdo.antejardin, null, 2);
					var antejardinizqvar = JSON.stringify(response.data[0].izquierdo.antejardinVariable, null, 2);
					var andenizq = JSON.stringify(response.data[0].izquierdo.anden, null, 2);
					var andenizqvar = JSON.stringify(response.data[0].izquierdo.andenVariable, null, 2);
					var calzadaizq = JSON.stringify(response.data[0].izquierdo.calzada, null, 2);
					var calzadaizqsep = JSON.stringify(response.data[0].izquierdo.calzadaSeparador, null, 2);
					var separadorizq = JSON.stringify(response.data[0].izquierdo.dimensionSeparador, null, 2);
					var observacionesizq = JSON.stringify(response.data[0].izquierdo.observacion, null, 2);
					var max = observacionesizq.length - 1;
					var observacionesizq = observacionesizq.substring(1, max);
					if ((observacionesizq == "ul")) { observacionesizq = "" };
					var numeroPredialIzquierdo = JSON.stringify(response.data[0].izquierdo.manzanaPredial, null, 2);
					var max = numeroPredialIzquierdo.length - 1;
					var numeroPredialIzquierdo = numeroPredialIzquierdo.substring(1, max);
					if ((numeroPredialIzquierdo == "ul")) { numeroPredialIzquierdo = "" };

					var antejardinder = JSON.stringify(response.data[0].derecho.antejardin, null, 2);
					var antejardindervar = JSON.stringify(response.data[0].derecho.antejardinVariable, null, 2);
					var andender = JSON.stringify(response.data[0].derecho.anden, null, 2);
					var andendervar = JSON.stringify(response.data[0].derecho.andenVariable, null, 2);
					var calzadader = JSON.stringify(response.data[0].derecho.calzada, null, 2);
					var calzadadersep = JSON.stringify(response.data[0].derecho.calzadaSeparador, null, 2);
					var separadorder = JSON.stringify(response.data[0].derecho.dimensionSeparador, null, 2);
					var observacionesder = JSON.stringify(response.data[0].derecho.observacion, null, 2);
					var max = observacionesder.length - 1;
					var observacionesder = observacionesder.substring(1, max);
					if ((observacionesder == "ul")) { observacionesder = "" };
					var numeroPredialDerecho = JSON.stringify(response.data[0].derecho.manzanaPredial, null, 2);
					var max = numeroPredialDerecho.length - 1;
					var numeroPredialDerecho = numeroPredialDerecho.substring(1, max);
					if ((numeroPredialDerecho == "ul")) { numeroPredialDerecho = "" };


					var observaciones = JSON.stringify(response.data[0].observaciones, null, 2);
					var max = observaciones.length - 1;
					var observaciones = observaciones.substring(1, max);
					if ((observaciones == "ul")) { observaciones = "" };

					var nombreViaPrincipal = JSON.stringify(response.data[0].nombreViaPrincipal, null, 2);
					var max = nombreViaPrincipal.length - 1;
					var nombreViaPrincipal = nombreViaPrincipal.substring(1, max);

					var nombreViaSecundaria = JSON.stringify(response.data[0].nombreViaSecundaria, null, 2);
					var max = nombreViaSecundaria.length - 1;
					var nombreViaSecundaria = nombreViaSecundaria.substring(1, max);

					var nombreViaTerciaria = JSON.stringify(response.data[0].nombreViaTerciaria, null, 2);
					var max = nombreViaTerciaria.length - 1;
					var nombreViaTerciaria = nombreViaTerciaria.substring(1, max);


					var fila_0 = "";
					var fila_1 = "";
					var fila_2 = "";
					var fila_3 = "";
					var fila_4 = "";
					var num_item = 0;

					var estandar_principal = JSON.stringify(response.data[0].tipoViaPrincipal.estandar, null, 2);
					var max = estandar_principal.length - 1;
					var estandar_principal = estandar_principal.substring(1, max);

					var estandar_secundario = JSON.stringify(response.data[0].tipoViaSecundaria.estandar, null, 2);
					var max = estandar_secundario.length - 1;
					var estandar_secundario = estandar_secundario.substring(1, max);

					//rebota



					if ((nombreViaTerciaria !== "ul")) {
						var estandar_terciario = JSON.stringify(response.data[0].tipoViaTerciaria.estandar, null, 2);
						var max = estandar_terciario.length - 1;
						var estandar_terciario = estandar_terciario.substring(1, max);

						var texto_terciario = JSON.stringify(response.data[0].tipoViaTerciaria.texto, null, 2);
						var max = texto_terciario.length - 1;
						var texto_terciario = texto_terciario.substring(1, max);

					} else {
						estandar_terciario = "  ";
						nombreViaTerciaria = " ";
						texto_terciario = " ";
					};





					var texto_principal = JSON.stringify(response.data[0].tipoViaPrincipal.texto, null, 2);
					var max = texto_principal.length - 1;
					var texto_principal = texto_principal.substring(1, max);

					var texto_secundario = JSON.stringify(response.data[0].tipoViaSecundaria.texto, null, 2);
					var max = texto_secundario.length - 1;
					var texto_secundario = texto_secundario.substring(1, max);
					//rebota




					//modificacion
					if ((separador != null) && (separador != "0") ) {


						if ((antejardinizq != null) && (antejardinizq != "0")) {
							fila_1+="<th><img alt='' height='40' src='https://saul.cali.gov.co/saul2/images/img_lineas/home.png' width='10' /></th>";
							fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><font size='1'></font></th>";
							fila_3+="<th><img height='7' src='https://saul.cali.gov.co/saul2/images/img_lineas/cota.png' width='10' /></th>";
							fila_4+="<th><font size='1'></font></th>";	


							fila_1 += "<th><img alt='Antejardin' height='40' src='https://saul.cali.gov.co/saul2/images/img_lineas/antejardin.png' width='24' /></th>";

							fila_2 += "<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Ant</font></p></th>";

							fila_3 += "<th><img height='7' src='https://saul.cali.gov.co/saul2/images/img_lineas/cota.png' width='24' /></th>";

							fila_4 += "<th><p align='center'><font size='1'>" + antejardinizq + "</font></p></th>";


						};
						if ((andenizq != null) && (andenizq != "0")) {
							fila_1 += "<th><img alt='Anden' height='40' src='https://saul.cali.gov.co/saul2/images/img_lineas/anden.png' width='32' /></th>";

							fila_2 += "<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>And</font></p></th>";

							fila_3 += "<th><img height='7' src='https://saul.cali.gov.co/saul2/images/img_lineas/cota.png' width='32' /></th>";

							fila_4 += "<th><p align='center'><font size='1'>" + andenizq + "</font></p></th>";


						};
						if ((separadorizq != null) && (separadorizq != "0")) {
							fila_1 += "<th><img alt='Calzada' height='40' src='https://saul.cali.gov.co/saul2/images/img_lineas/calzada.png' width='48' /></th>\
									   <th><img alt='Separador' height='40' src='https://saul.cali.gov.co/saul2/images/img_lineas/separador.png' width='21' /></th>";
							fila_2 += "<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Calz</font></p></th>\
						               <th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Sep</font></p></th>";
							fila_3 += "<th><img height='7' src='https://saul.cali.gov.co/saul2/images/img_lineas/cota.png' width='48' /></th>\
						               <th><img height='7' src='https://saul.cali.gov.co/saul2/images/img_lineas/cota.png' width='21' /></th>";
							fila_4 += "<th><p align='center'><font size='1'>" + calzadaizqsep + "</font></p></th>\
						               <th><p align='center'><font size='1'>"+ separadorizq + "</font></p></th>";
							num_item += 2;

						};

						if ((calzadaizq != null) && (calzadaizq != "0")) {
							fila_1 += "<th><img alt='Calzada' height='40' src='https://saul.cali.gov.co/saul2/images/img_lineas/calzada.png' width='48' /></th>";

							fila_2 += "<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Calz</font></p></th>";

							fila_3 += "<th><img height='7' src='https://saul.cali.gov.co/saul2/images/img_lineas/cota.png' width='48' /></th>";

							fila_4 += "<th><p align='center'><font size='1'>" + calzadaizq + "</font></p></th>";


						};



						
						if ((separador!=null)&&(separador!="0")) {
							fila_1 += "<th><img alt='Separador' height='40' src='https://saul.cali.gov.co/saul2/images/img_lineas/separador.png' width='21' /></th>";
							fila_2 += "<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Sep</font></p></th>";
							fila_3 += "<th><img height='7' src='https://saul.cali.gov.co/saul2/images/img_lineas/cota.png' width='21' /></th>";
							fila_4 += "<th><p align='center'><font size='1'>" + separador + "</font></p></th>";
						};

						if ((calzadader != null) && (calzadader != "0")) {
							fila_1 += "<th><img alt='Calzada' height='40' src='https://saul.cali.gov.co/saul2/images/img_lineas/calzada.png' width='48' /></th>";

							fila_2 += "<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Calz</font></p></th>";

							fila_3 += "<th><img height='7' src='https://saul.cali.gov.co/saul2/images/img_lineas/cota.png' width='48' /></th>";

							fila_4 += "<th><p align='center'><font size='1'>" + calzadader + "</font></p></th>";


						};

						if ((separadorder != null) && (separadorder != "0")) {
							fila_1 += "<th><img alt='Separador' height='40' src='https://saul.cali.gov.co/saul2/images/img_lineas/separador.png' width='21' /></th>\
									  <th><img alt='Calzada' height='40' src='https://saul.cali.gov.co/saul2/images/img_lineas/calzada.png' width='48' /></th>";
							fila_2 += "<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Sep</font></p></th>\
						               <th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Calz</font></p></th>";
							fila_3 += "<th><img height='7' src='https://saul.cali.gov.co/saul2/images/img_lineas/cota.png' width='21' /></th>\
						               <th><img height='7' src='https://saul.cali.gov.co/saul2/images/img_lineas/cota.png' width='48' /></th>";
							fila_4 += "<th><p align='center'><font size='1'>" + separadorder + "</font></p></th>\
						               <th><p align='center'><font size='1'>"+ calzadadersep + "</font></p></th>";
							num_item += 2;

						};






						
						if ((andender != null) && (andender != "0")) {
							fila_1 += "<th><img alt='Anden' height='40' src='https://saul.cali.gov.co/saul2/images/img_lineas/anden2.png' width='32' /></th>";

							fila_2 += "<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>And</font></p></th>";

							fila_3 += "<th><img height='7' src='https://saul.cali.gov.co/saul2/images/img_lineas/cota.png' width='32' /></th>";

							fila_4 += "<th><p align='center'><font size='1'>" + andender + "</font></p></th>";


						};
						if ((antejardinder != null) && (antejardinder != "0")) {
							fila_1 += "<th><img alt='Antejardin' height='40' src='https://saul.cali.gov.co/saul2/images/img_lineas/antejardin2.png' width='24' /></th>";

							fila_2 += "<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Ant</font></p></th>";

							fila_3 += "<th><img height='7' src='https://saul.cali.gov.co/saul2/images/img_lineas/cota.png' width='24' /></th>";

							fila_4 += "<th><p align='center'><font size='1'>" + antejardinder + "</font></p></th>";

							fila_1+="<th><img alt='' height='40' src='https://saul.cali.gov.co/saul2/images/img_lineas/home2.png' width='10' /></th>";
							fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><font size='1'></font></th>";
							fila_3+="<th><img height='7' src='https://saul.cali.gov.co/saul2/images/img_lineas/cota.png' width='10' /></th>";
							fila_4+="<th><font size='1'></font></th>";

						};

						num_item += 10;

					} else {
						if ((antejardinizq != null) && (antejardinizq != "0")) {
							fila_1+="<th><img alt='' height='40' src='https://saul.cali.gov.co/saul2/images/img_lineas/home.png' width='10' /></th>";
							fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><font size='1'></font></th>";
							fila_3+="<th><img height='7' src='https://saul.cali.gov.co/saul2/images/img_lineas/cota.png' width='10' /></th>";
							fila_4+="<th><font size='1'></font></th>";	

							fila_1 += "<th><img alt='Antejardin' height='40' src='https://saul.cali.gov.co/saul2/images/img_lineas/antejardin.png' width='24' /></th>";

							fila_2 += "<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Ant</font></p></th>";

							fila_3 += "<th><img height='7' src='https://saul.cali.gov.co/saul2/images/img_lineas/cota.png' width='24' /></th>";

							fila_4 += "<th><p align='center'><font size='1'>" + antejardinizq + "</font></p></th>";

							num_item += 1;

						}else{	
							if ((calzada!=null)&&(calzada!="0")) {
							}else{
								fila_1+="<th><img alt='' height='40' src='https://saul.cali.gov.co/saul2/images/img_lineas/home.png' width='10' /></th>";
								fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><font size='1'></font></th>";
								fila_3+="<th><img height='7' src='http://172.18.110.180/prueba_lineas/img_lineas/cota.png' width='10' /></th>";
								fila_4+="<th><font size='1'></font></th>";


								};
			             };

						if ((andenizq != null) && (andenizq != "0")) {
							fila_1 += "<th><img alt='Anden' height='40' src='https://saul.cali.gov.co/saul2/images/img_lineas/anden.png' width='32' /></th>";

							fila_2 += "<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>And</font></p></th>";

							fila_3 += "<th><img height='7' src='https://saul.cali.gov.co/saul2/images/img_lineas/cota.png' width='32' /></th>";

							fila_4 += "<th><p align='center'><font size='1'>" + andenizq + "</font></p></th>";

							num_item += 1;

						};
						if ((calzada != null) && (calzada != "0")) {
							fila_1 += "<th><img alt='Calzada' height='40' src='https://saul.cali.gov.co/saul2/images/img_lineas/calzada.png' width='48' /></th>";

							fila_2 += "<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Calz</font></p></th>";

							fila_3 += "<th><img height='7' src='https://saul.cali.gov.co/saul2/images/img_lineas/cota.png' width='48' /></th>";

							fila_4 += "<th><p align='center'><font size='1'>" + calzada + "</font></p></th>";

							num_item += 1;

						}else{
							//via
							fila_1+="<th><img alt='Detalle en las observaciones' height='40' src='https://saul.cali.gov.co/saul2/images/img_lineas/via.png' width='48' /></th>";
							fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Via*</font></p></th>";
							fila_3+="<th><img height='7' src='https://saul.cali.gov.co/saul2/images/img_lineas/cota.png' width='48' /></th>";
							fila_4+="<th><p align='center'><font size='1'>"+via+"</font></p></th>";

						};
						if ((andender != null) && (andender != "0")) {
							fila_1 += "<th><img alt='Anden' height='40' src='https://saul.cali.gov.co/saul2/images/img_lineas/anden2.png' width='32' /></th>";

							fila_2 += "<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>And</font></p></th>";

							fila_3 += "<th><img height='7' src='https://saul.cali.gov.co/saul2/images/img_lineas/cota.png' width='32' /></th>";

							fila_4 += "<th><p align='center'><font size='1'>" + andender + "</font></p></th>";

							num_item += 1;

						};
						if ((antejardinder != null) && (antejardinder != "0")) {
							fila_1 += "<th><img alt='Antejardin' height='40' src='https://saul.cali.gov.co/saul2/images/img_lineas/antejardin2.png' width='24' /></th>";

							fila_2 += "<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Ant</font></p></th>";

							fila_3 += "<th><img height='7' src='https://saul.cali.gov.co/saul2/images/img_lineas/cota.png' width='24' /></th>";

							fila_4 += "<th><p align='center'><font size='1'>" + antejardinder + "</font></p></th>";

							fila_1+="<th><img alt='' height='40' src='https://saul.cali.gov.co/saul2/images/img_lineas/home2.png' width='10' /></th>";
							fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><font size='1'></font></th>";
							fila_3+="<th><img height='7' src='https://saul.cali.gov.co/saul2/images/img_lineas/cota.png' width='10' /></th>";
							fila_4+="<th><font size='1'></font></th>";

							num_item += 2;

						}else{
							if ((calzada!=null)&&(calzada!="0")) {
							}else{
								fila_1+="<th><img alt='' height='40' src='https://saul.cali.gov.co/saul2/images/img_lineas/home2.png' width='10' /></th>";
								fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><font size='1'></font></th>";
								fila_3+="<th><img height='7' src='https://saul.cali.gov.co/saul2/images/img_lineas/cota.png' width='10' /></th>";
								fila_4+="<th><font size='1'></font></th>";
						    };
					    };


						num_item += 1;




					};
					num_item -= 5;
					for (paso = 0; paso < num_item; paso++) {
						fila_0 += "<th></th>";
					};



					view.popup.title = texto_principal + " " + nombreViaPrincipal + " entre " + texto_secundario + " " + nombreViaSecundaria + " y " + texto_terciario + " " + nombreViaTerciaria;
					view.popup.content = //view.popup.selectedFeature.attributes.id +
						"<table border='0' cellpadding='0' cellspacing='0' align=center width=100%><tr><td><font size=2><b>Corte 1-1</b></font></td><td><a text-decoration: underline; target= blank href='https://saul.cali.gov.co/saul/v2/#!/perfilvial/crearperfilvial/" + view.popup.selectedFeature.attributes.id + "' title='Consulta en SAUL'><font size=2>Consulta en SAUL </font></a></td><td><a  text-decoration: underline;  target= blank href=" + urlFuente1 + " title='Consulta en SAUL'>Fuente 1 ("+fuente1+")</a></td><td>" + fuente2_url + "</td></tr></table> <br/> " +
						"Linea No.  "+view.popup.selectedFeature.attributes.id+"</br><p align='center' style='color:rgba(66,7,7,1)';><b>"+claseVia+"</b></p>"+
						"<div style='text-align: center; width:100%'><table border='0' cellpadding='0' cellspacing='0' align='center' style='text-align: center;'>" +
	          		/*"<tr>"+
						"<th colspan='2'><font size='1'>Manzana Izqu</font></th>"+fila_0+
						"<th colspan='2'><font size='1'>Manzana Der</font></th>"+							
					"</tr><tr>"+
						"<th colspan='2'><font size='1'>#"+numeroPredialIzquierdo+"</font></th>"+fila_0+
						"<th colspan='2'><font size='1'>#"+numeroPredialDerecho+"</font></th>"+							
					"</tr>"+*/
						"<tr>" + fila_1 +
						"</tr><tr align='center'>" + fila_2 +
						"</tr><tr>" + fila_3 +
						"</tr><tr align='center'>" + fila_4 +
						"</tr>" +
						"</table>" +
						"<b>*Las medidas se encuentran en metros</b>" +


						"<br/><table border='0' cellpadding='0' cellspacing='0'  align='center' style='text-align: center;'>" +
						"<tr >" +
						"<th></th>" +
						"<th colspan='5'><p align='center'><font size='1'>" + estandar_terciario + " " + nombreViaTerciaria + "</font></p></th>" +
						"</tr >" +
						"<tr>" +
						"<th ><img  height='65' src='https://saul.cali.gov.co/saul2/images/img_lineas/corte 1.png' width='30' /></th>" +
						"<th style='height: 7px; transform: rotate(-90deg);'><font size='1'>Manzana Izqu<br>#" + numeroPredialIzquierdo + "</font></th>" +
						"<th><img  height='65' src='https://saul.cali.gov.co/saul2/images/img_lineas/manzana.png' width='30' /></th>" +
						"<th>" +
						"<table border='0' cellpadding='0' cellspacing='0' style='text-align: center;'>" +
						"<tr>" +
						"<th style='height: 10px; width: 30px; transform: rotate(-90deg);'><font size='1'>" + estandar_principal + " " + nombreViaPrincipal + "</font></th>" +
						"</tr >" +
						"<th></th>" +
						"<tr>" +
						"<th align='center'><img  height='23' src='https://saul.cali.gov.co/saul2/images/img_lineas/vista.png' width='20' /></th>" +
						"</tr >" +
						"</table>" +
						"</th>" +
						"<th><img  height='65' src='https://saul.cali.gov.co/saul2/images/img_lineas/manzana2.png' width='30' /></th>" +
						"<th style='height: 7px; transform: rotate(-90deg);'><font size='1'>Manzana Der<br>#" + numeroPredialDerecho + "</font></th>" +
						"<th><img  height='65' src='https://saul.cali.gov.co/saul2/images/img_lineas/corte 2.png' width='30' /></th>" +
						"</tr>" +
						"<tr >" +
						"<th></th>" +
						"<th colspan='5'><p align='center'><font size='1'>" + estandar_secundario + " " + nombreViaSecundaria + "</font></p></th>" +
						"</tr >" +
						"</table>" +
						"<table  align='center' width=100%>" +
						"<tr><th style='text-align: left;'>Observaciones izquierda</th><th style='text-align: right;'>Observaciones derecha</th></tr>" +
						"<tr><td style='text-align: left;'><div>" + observacionesizq + "</div></th>" +
						"<td style='text-align: right;'><div>" + observacionesder + "</div></th></tr>" +
						"<tr><th colspan='2' style='text-align: center;'>Observaciones generales:</th></tr>" +
						"<tr><td colspan='2' style='text-align: left;'><div style='word-wrap: break-word; max-width:99%; width:99%; font-size:1'>" + observaciones + "</div></td></tr><br>" +
						"<tr><td colspan='2' align=justify style='text-align: justify;'><div style='word-wrap: break-word; max-width:99%; width:99%; font-size:1'><b>Nota:</b>Tenga en cuenta que para los predios esquineros solo pueden hacer uso de este aplicativo siempre y cuando tengan la línea por cada uno de sus costados y los que no cumplan con esta condición deben radicar la solicitud llenando el formato<a href='https://saul.cali.gov.co/saul/'>AQUI</a>.</div></td></tr><br>" +
						"<tr><td colspan='2' style='text-align: left;'><div style='word-wrap: break-word; max-width:99%; width:99%; font-size:1'><b>Conveciones</b><br> <b>Ant :</b>  Antejardin <b>And :</b>  Anden <b>Calz:</b> Calzada  <b>Sep:</b> Separador .</div></td></tr>" +
						"</table> " +
						"</div>";
				});
				return "<img id='loadingImg' src='https://saul.cali.gov.co/saul/images/loader.gif' style='position:relative; left:50%; top:50%; z-index:100;' />"; 
			};

			view.popup.on("trigger-action", function (event) {
				// Execute the measureThis() function if the measure-this action is clicked
				console.log("evento", event);
				if (event.action.id === "draw-this") {
					drawThis();
				} else if (event.action.id === "streetview-this") {
					streetviewThis();
				}
			});


		});