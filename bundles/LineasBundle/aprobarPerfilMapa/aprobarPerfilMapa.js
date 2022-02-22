// import("https://js.arcgis.com/4.8/");
saul.config(["$stateProvider", function(a) {
    a.state("aprobar-perfil-mapa", {
        url: "/perfil/aprobarperfilmapa/",
        views: {
            main: {
                controller: "AprobarPerfilMapaCtrl",
                templateUrl: "../bundles/LineasBundle/aprobarPerfilMapa/aprobarPerfilMapa.tpl.html"
            }
        }
    })
}]).controller("AprobarPerfilMapaCtrl", ["$scope","esriLoader", "root",   
    function($scope, esriLoader, root) {
        var self = this;
        self.viewLoaded = false;
        $scope.root = root;
        $scope.viewLoaded = false;
        $scope.urlImagenes = "//planeacion.cali.gov.co/saul2/images/img_lineas/";
        $scope.imageStreetView = ""+$scope.urlImagenes+"street_view.png";
        $scope.urlGeoportal = "https://geoportal.cali.gov.co/agserver/rest/services/Lineas/lineas_auto/MapServer/0";                               

        esriLoader.require([
            'esri/Map',
            'esri/views/MapView',
            'esri/layers/FeatureLayer',
            'esri/widgets/BasemapToggle',
            'esri/widgets/Search',
            'esri/config',
            'esri/request',
        ],function(Map, MapView, FeatureLayer, BasemapToggle, Search, esriConfig, esriRequest){

            //Definición del Mapa
            self.map = new Map({
                basemap: 'streets'
            });



            //Definición del MapView
            view = new MapView({
                container: "viewDiv",
                map: self.map,
                zoom:13,
                center:[-76.52, 3.435],
                highlightOptions: {
                    color: [255,241,58],
                    fillOpacity:0.4
                },
                popup: {
                    actionsMenuEnabled: false                    
                }
            });

            


            //Definición de BasemapToggle
            var toggle = new BasemapToggle({
                view: $scope.view,
                nextBasemap: "hybrid"
            });
            view.ui.add(toggle, "bottom-right");



            //Definición del Popup Template perfiles
            /*var streetview = {
                title: "Ver street view",
                id: "streetview-this",                
                image: $scope.imageStreetView
            };*/
            var templatePerfiles = {
                title: "{tipo} {nomenclatu} ",
                content: drawThis,
                updateLocationEnabled: true,

                actions: []
            };
            var perfiles = new FeatureLayer({
                url: $scope.urlGeoportal,
                outFields:["*"],
                popupTemplate: templatePerfiles               
            });
            self.map.add(perfiles);

            view.whenLayerView(perfiles)
                .then(function (layerView) {

                    // if a feature is already highlighted, then remove the highlight
                    if (highlightSelect) {
                        highlightSelect.remove();
                    }

                    // set the highlight on the first feature returned by the query
                    highlightSelect = layerView.highlight(feature);
                });

            actualizarCapa = function() {
				perfiles.refresh();				
			}




            $scope.onViewCreated = function(view) {
                var searchWidget = new Search({
                    view: view                                      
                });
                
                searchWidget.sources =[{
                    featureLayer: {
                    url: "https://geoportal.cali.gov.co/agserver/rest/services/Lineas/lineas_auto/MapServer/0",
                    popupTemplate: { 
                        title: "{numero_pre}",
                        overwriteActions: true
                    }
                    },
                    searchFields: ["numero_pre","numero_nal"],
                    displayField: "numero_pre",
                    exactMatch: false,
                    outFields: ["*"],
                    name: "Número Predial",
                    placeholder: "F038600080000",
                }] ;

                // add the search widget to the top left corner of the view
                view.ui.add(searchWidget, {
                    position: 'top-right',
                    index: 0
                });

                // destroy the search widget when angular scope is also being destroyed
                $on('$destroy', function() {
                    searchWidget.destroy();
                });
            };

            //Vistas de street view y vista del perfil
            /*    function streetviewThis() {
		
                var lat=view.popup.location.latitude;
                var lng=view.popup.location.longitude;
                view.popup.content ="<iframe width='100%' height='200px' src='streetview.php?lat="+lat+"&lng="+lng+"' ></iframe>";
            };/*/


            function drawThis(target) {
                $scope.perfilId = view.popup.selectedFeature.attributes.id;
                var url = "http://planeacion.cali.gov.co/saul2/app_dev.php/perfilvial/"+view.popup.selectedFeature.attributes.id;
                esriRequest(url,{responseType: 'json'}).then(function(response) {
                
                var via=JSON.stringify(response.data[0].via,null,2);
                var estado=JSON.stringify(response.data[0].estado.nombre,null,2);
                var calzada=JSON.stringify(response.data[0].calzada,null,2);
                var claseVia=JSON.stringify(response.data[0].claseVia.texto,null,2);
                var max=claseVia.length-1;
                var claseVia=claseVia.substring(1,max);	
        
                var separador=JSON.stringify(response.data[0].dimensionSeparador,null,2);
                
                var urlFuente1 = JSON.stringify(response.data[0].urlFuente1, null, 2);
                var urlFuente2 = JSON.stringify(response.data[0].urlFuente2, null, 2);

                var fuente1 = JSON.stringify(response.data[0].fuente1, null, 2);
                var fuente2 = JSON.stringify(response.data[0].fuente2, null, 2);
                if ((fuente2 == null || fuente2==0)) { fuente2_url = "" } else { var fuente2_url = "<a target= blank href=" + urlFuente2 + " title='Consulta en SAUL'>Fuente 2 </a>"; };

                var antejardinizq=JSON.stringify(response.data[0].izquierdo.antejardin,null,2);
                var antejardinizqvar=JSON.stringify(response.data[0].izquierdo.antejardinVariable,null,2);
                var andenizq=JSON.stringify(response.data[0].izquierdo.anden,null,2);
                var andenizqvar=JSON.stringify(response.data[0].izquierdo.andenVariable,null,2);
                var calzadaizq=JSON.stringify(response.data[0].izquierdo.calzada,null,2);		
                var calzadaizqsep=JSON.stringify(response.data[0].izquierdo.calzadaSeparador,null,2);
                var separadorizq=JSON.stringify(response.data[0].izquierdo.dimensionSeparador,null,2);
                var observacionesizq=JSON.stringify(response.data[0].izquierdo.observacion,null,2);
                var max=observacionesizq.length-1;
                var observacionesizq=observacionesizq.substring(1,max);
                if ((observacionesizq=="ul")) {observacionesizq=""};
                var numeroPredialIzquierdo=JSON.stringify(response.data[0].izquierdo.manzanaPredial,null,2);
                var max=numeroPredialIzquierdo.length-1;
                var numeroPredialIzquierdo=numeroPredialIzquierdo.substring(1,max);
                if ((numeroPredialIzquierdo=="ul")) {numeroPredialIzquierdo=""};
            
                var antejardinder=JSON.stringify(response.data[0].derecho.antejardin,null,2);
                var antejardindervar=JSON.stringify(response.data[0].derecho.antejardinVariable,null,2);
                var andender=JSON.stringify(response.data[0].derecho.anden,null,2);
                var andendervar=JSON.stringify(response.data[0].derecho.andenVariable,null,2);
                var calzadader=JSON.stringify(response.data[0].derecho.calzada,null,2);		
                var calzadadersep=JSON.stringify(response.data[0].derecho.calzadaSeparador,null,2);
                var separadorder=JSON.stringify(response.data[0].derecho.dimensionSeparador,null,2);
                var observacionesder=JSON.stringify(response.data[0].derecho.observacion,null,2);
                var max=observacionesder.length-1;
                var observacionesder=observacionesder.substring(1,max);
                if ((observacionesder=="ul")) {observacionesder=""};
                var numeroPredialDerecho=JSON.stringify(response.data[0].derecho.manzanaPredial,null,2);
                var max=numeroPredialDerecho.length-1;
                var numeroPredialDerecho=numeroPredialDerecho.substring(1,max);
                if ((numeroPredialDerecho=="ul")) {numeroPredialDerecho=""};
        
        
                var observaciones=JSON.stringify(response.data[0].observaciones,null,2);
                var max=observaciones.length-1;
                var observaciones=observaciones.substring(1,max);
                if ((observaciones=="ul")) {observaciones=""};
                
                var nombreViaPrincipal=JSON.stringify(response.data[0].nombreViaPrincipal,null,2);
                var max=nombreViaPrincipal.length-1;
                var nombreViaPrincipal=nombreViaPrincipal.substring(1,max);
        
                var nombreViaSecundaria=JSON.stringify(response.data[0].nombreViaSecundaria,null,2);
                var max=nombreViaSecundaria.length-1;
                var nombreViaSecundaria=nombreViaSecundaria.substring(1,max);
        
                var nombreViaTerciaria=JSON.stringify(response.data[0].nombreViaTerciaria,null,2);
                var max=nombreViaTerciaria.length-1;
                var nombreViaTerciaria=nombreViaTerciaria.substring(1,max);
                
                
                var fila_0="";
                var fila_1="";
                var fila_2="";
                var fila_3="";
                var fila_4="";
                var num_item=0;
        
                var estandar_principal=JSON.stringify(response.data[0].tipoViaPrincipal.estandar,null,2);
                var max=estandar_principal.length-1;
                var estandar_principal=estandar_principal.substring(1,max);
        
                var estandar_secundario=JSON.stringify(response.data[0].tipoViaSecundaria.estandar,null,2);
                var max=estandar_secundario.length-1;
                var estandar_secundario=estandar_secundario.substring(1,max);
                
        //rebota
        
                
        
                if ((nombreViaTerciaria!=="ul")) {
                var estandar_terciario=JSON.stringify(response.data[0].tipoViaTerciaria.estandar,null,2);
                var max=estandar_terciario.length-1;
                var estandar_terciario=estandar_terciario.substring(1,max);	
        
                var texto_terciario=JSON.stringify(response.data[0].tipoViaTerciaria.texto,null,2);
                var max=texto_terciario.length-1;
                var texto_terciario=texto_terciario.substring(1,max);
        
                }else{
                    estandar_terciario="  ";
                    nombreViaTerciaria=" ";
                    texto_terciario=" ";
                };
                
            
                
        
        
                var texto_principal=JSON.stringify(response.data[0].tipoViaPrincipal.texto,null,2);
                var max=texto_principal.length-1;
                var texto_principal=texto_principal.substring(1,max);
        
                var texto_secundario=JSON.stringify(response.data[0].tipoViaSecundaria.texto,null,2);
                var max=texto_secundario.length-1;
                var texto_secundario=texto_secundario.substring(1,max);
        //rebota
        
        
        
        
                //
                if ((separador!=null)&&(separador!="0")) {
                    if ((antejardinizq!=null)&&(antejardinizq!="0")) {
                        fila_1+="<th><img alt='' height='40' src='"+$scope.urlImagenes+"home.png' width='10' /></th>";
                        fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><font size='1'></font></th>";
                        fila_3+="<th><img height='7' src='"+$scope.urlImagenes+"cota.png' width='10' /></th>";
                        fila_4+="<th><font size='1'></font></th>";

                        fila_1+="<th><img alt='Antejardin' height='40' src='"+$scope.urlImagenes+"antejardin.png' width='24' /></th>";
                        fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Ant</font></p></th>";
                        fila_3+="<th><img height='7' src='"+$scope.urlImagenes+"cota.png' width='24' /></th>";
                        fila_4+="<th><p align='center'><font size='1'>"+antejardinizq+"</font></p></th>";
                    };
                    if ((andenizq!=null)&&(andenizq!="0")) {
                        fila_1+="<th><img alt='Anden' height='40' src='"+$scope.urlImagenes+"anden.png' width='32' /></th>";
                        fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>And</font></p></th>";
                        fila_3+="<th><img height='7' src='"+$scope.urlImagenes+"cota.png' width='32' /></th>";
                        fila_4+="<th><p align='center'><font size='1'>"+andenizq+"</font></p></th>";    
                    };

                    if ((separadorizq!=null)&&(separadorizq!="0")) {
                        fila_1+="<th><img alt='Calzada' height='40' src='"+$scope.urlImagenes+"calzada.png' width='48' /></th>\
                                 <th><img alt='Separador' height='40' src='"+$scope.urlImagenes+"separador.png' width='21' /></th>";
                        fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Calz</font></p></th>\
                                 <th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Sep</font></p></th>";
                        fila_3+="<th><img height='7' src='"+$scope.urlImagenes+"cota.png' width='48' /></th>\
                                 <th><img height='7' src='"+$scope.urlImagenes+"cota.png' width='21' /></th>";
                        fila_4+="<th><p align='center'><font size='1'>"+calzadaizqsep+"</font></p></th>\
                                 <th><p align='center'><font size='1'>"+separadorizq+"</font></p></th>";          
                        num_item+=2;
                    
                    };

                    if ((calzadaizq!=null)&&(calzadaizq!="0")) {
                        fila_1+="<th><img alt='Calzada' height='40' src='"+$scope.urlImagenes+"calzada.png' width='48' /></th>";        
                        fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Calz</font><p></th>";            
                        fila_3+="<th><img height='7' src='"+$scope.urlImagenes+"cota.png' width='48' /></th>";            
                        fila_4+="<th><p align='center'><font size='1'>"+calzadaizq+"</font></p></th>";                                    
                    };        
                    if ((separador!=null)&&(separador!="0")) {
                        fila_1+="<th><img alt='Separador' height='40' src='"+$scope.urlImagenes+"separador.png' width='21' /></th>";
                        fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Sep</font></p></th>";
                        fila_3+="<th><img height='7' src='"+$scope.urlImagenes+"cota.png' width='21' /></th>";
                        fila_4+="<th><p align='center'><font size='1'>"+separador+"</font></p></th>";
                    };
                    if ((calzadader!=null)&&(calzadader!="0")) {
                        fila_1+="<th><img alt='Calzada' height='40' src='"+$scope.urlImagenes+"calzada.png' width='48' /></th>";
                        fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Calz</font></p></th>";
                        fila_3+="<th><img height='7' src='"+$scope.urlImagenes+"cota.png' width='48' /></th>";
                        fila_4+="<th><p align='center'><font size='1'>"+calzadader+"</font></p></th>";
                    };	            
                    if ((separadorder!=null)&&(separadorder!="0")) {
                        fila_1+="<th><img alt='Separador' height='40' src='"+$scope.urlImagenes+"separador.png' width='21' /></th>\
                                 <th><img alt='Calzada' height='40' src='"+$scope.urlImagenes+"calzada.png' width='48' /></th>";
                        fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Calz</font></p></th>\
                                <th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Sep</font></p></th>";
                        fila_3+="<th><img height='7' src='"+$scope.urlImagenes+"cota.png' width='21' /></th>\
                                <th><img height='7' src='"+$scope.urlImagenes+"cota.png' width='48' /></th>";
                        fila_4+="<th><p align='center'><font size='1'>"+separadorder+"</font></p></th>\
                                <th><p align='center'><font size='1'>"+calzadadersep+"</font></p></th>";			
                        num_item+=2;
                    
                    };
                    
                    if ((andender!=null)&&(andender!="0")) {
                        fila_1+="<th><img alt='Anden' height='40' src='"+$scope.urlImagenes+"anden2.png' width='32' /></th>";
                        fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>And</font></p></th>";
                        fila_3+="<th><img height='7' src='"+$scope.urlImagenes+"cota.png' width='32' /></th>";
                        fila_4+="<th><p align='center'><font size='1'>"+andender+"</font></p></th>";                    
                    };
                    if ((antejardinder!=null)&&(antejardinder!="0")) {
                        fila_1+="<th><img alt='Antejardin' height='40' src='"+$scope.urlImagenes+"antejardin2.png' width='24' /></th>";
                        fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Ant</font></p></th>";
                        fila_3+="<th><img height='7' src='"+$scope.urlImagenes+"cota.png' width='24' /></th>";
                        fila_4+="<th><p align='center'><font size='1'>"+antejardinder+"</font></p></th>";

                        fila_1+="<th><img alt='' height='40' src='"+$scope.urlImagenes+"home2.png' width='10' /></th>";
                        fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><font size='1'></font></th>";
                        fila_3+="<th><img height='7' src='"+$scope.urlImagenes+"cota.png' width='10' /></th>";
                        fila_4+="<th><font size='1'></font></th>";  
                    };
                    num_item+=10;                
                }else{
                    if ((antejardinizq!=null)&&(antejardinizq!="0")) {
                        fila_1+="<th><img alt='' height='40' src='"+$scope.urlImagenes+"home.png' width='10' /></th>";
                        fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><font size='1'></font></th>";
                        fila_3+="<th><img height='7' src='"+$scope.urlImagenes+"cota.png' width='10' /></th>";
                        fila_4+="<th><font size='1'></font></th>";

                        fila_1+="<th><img alt='Antejardin' height='40' src='"+$scope.urlImagenes+"antejardin.png' width='24' /></th>";
                        fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Ant</font></p></th>";
                        fila_3+="<th><img height='7' src='"+$scope.urlImagenes+"cota.png' width='24' /></th>";
                        fila_4+="<th><p align='center'><font size='1'>"+antejardinizq+"</font></p></th>";
                        num_item+=2;
                    }else{  
                        if ((calzada!=null)&&(calzada!="0")) {
                        }else{
                                fila_1+="<th><img alt='' height='40' src='"+$scope.urlImagenes+"home.png' width='10' /></th>";
                                fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><font size='1'></font></th>";
                                fila_3+="<th><img height='7' src='"+$scope.urlImagenes+"cota.png' width='10' /></th>";
                                fila_4+="<th><font size='1'></font></th>";
                            };
                    };
                    if ((andenizq!=null)&&(andenizq!="0")) {
                        fila_1+="<th><img alt='Anden' height='40' src='"+$scope.urlImagenes+"anden.png' width='32' /></th>";
                        fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>And</font></p></th>";
                        fila_3+="<th><img height='7' src='"+$scope.urlImagenes+"cota.png' width='32' /></th>";
                        fila_4+="<th><p align='center'><font size='1'>"+andenizq+"</font></p></th>";
                        num_item+=1;
                    };
                    if ((calzada!=null)&&(calzada!="0")) {
                        fila_1+="<th><img alt='Calzada' height='40' src='"+$scope.urlImagenes+"calzada.png' width='48' /></th>";
                        fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Calz</font></p></th>";
                        fila_3+="<th><img height='7' src='"+$scope.urlImagenes+"cota.png' width='48' /></th>";
                        fila_4+="<th><p align='center'><font size='1'>"+calzada+"</font></p></th>";
                        num_item+=1;
                    }else{
                        //via
                        fila_1+="<th><img alt='Detalle en las observaciones' height='40' src='"+$scope.urlImagenes+"via.png' width='48' /></th>";
                        fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Via*</font></p></th>";
                        fila_3+="<th><img height='7' src='"+$scope.urlImagenes+"cota.png' width='48' /></th>";
                        fila_4+="<th><p align='center'><font size='1'>"+via+"</font></p></th>";
                    };
                    if ((andender!=null)&&(andender!="0")) {
                        fila_1+="<th><img alt='Anden' height='40' src='"+$scope.urlImagenes+"anden2.png' width='32' /></th>";
                        fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>And</font></p></th>";        
                        fila_3+="<th><img height='7' src='"+$scope.urlImagenes+"cota.png' width='32' /></th>";
                        fila_4+="<th><p align='center'><font size='1'>"+andender+"</font></p></th>";
                        num_item+=1;                    
                    };
                    if ((antejardinder!=null)&&(antejardinder!="0")) {
                        fila_1+="<th><img alt='Antejardin' height='40' src='"+$scope.urlImagenes+"antejardin2.png' width='24' /></th>";
                        fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><p align='center'><font size='1'>Ant</font></p></th>";
                        fila_3+="<th><img height='7' src='"+$scope.urlImagenes+"cota.png' width='24' /></th>";
                        fila_4+="<th><p align='center'><font size='1'>"+antejardinder+"</font></p></th>";

                        fila_1+="<th><img alt='' height='40' src='"+$scope.urlImagenes+"home2.png' width='10' /></th>";
                        fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><font size='1'></font></th>";
                        fila_3+="<th><img height='7' src='"+$scope.urlImagenes+"cota.png' width='10' /></th>";
                        fila_4+="<th><font size='1'></font></th>";  

                        num_item+=2;
                    
                    }else{
                        if ((calzada!=null)&&(calzada!="0")) {
                        }else{
                            fila_1+="<th><img alt='' height='40' src='"+$scope.urlImagenes+"home2.png' width='10' /></th>";
                            fila_2+="<th style='height: 20px; transform: rotate(-90deg);'><font size='1'></font></th>";
                            fila_3+="<th><img height='7' src='"+$scope.urlImagenes+"cota.png' width='10' /></th>";
                            fila_4+="<th><font size='1'></font></th>";
                        };
                    };
                    num_item+=1;        
                };
                num_item-=5;
                for (paso = 0; paso < num_item; paso++) {
                    fila_0+="<th></th>";		  
                };
        
                
                view.popup.title =texto_principal+" "+nombreViaPrincipal+" entre "+texto_secundario+" "+nombreViaSecundaria+" y "+texto_terciario+" "+nombreViaTerciaria;
                view.popup.content = //view.popup.selectedFeature.attributes.id +
                  "<table border='0' cellpadding='0' cellspacing='0' align=center width=100%><tr><td>Corte 1-1</td><td><a text-decoration: underline; target= blank href='https://planeacion.cali.gov.co/saul/v2/#!/perfilvial/crearperfilvial/"+view.popup.selectedFeature.attributes.id+"' title='Consultar en SAUL'>Consultar en SAUL </a></td><td><a target='_blank' href="+urlFuente1+" title='Fuente 1'>Fuente 1 ("+fuente1+") </a></td><td>"+fuente2_url+"</td></tr></table>  "+ 
                  "Linea No.  "+view.popup.selectedFeature.attributes.id+"</br><p align='center' style='color:rgba(66,7,7,1)';><b>"+claseVia+"</b></p>"+
                          "<div style='text-align: center; width:100%'><table border='0' cellpadding='0' cellspacing='0' align='center' style='text-align: center;'>"+
                            "<tr>"+fila_1+
                            "</tr><tr align='center'>"+fila_2+					
                            "</tr><tr>"+fila_3+					
                            "</tr><tr align='center'>"+fila_4+
                            "</tr>"+
                        "</table>"+				
                        "*Las medidas se encuentran en metros"+
                
        
                    "<table border='0' cellpadding='0' cellspacing='0'  align='center' style='text-align: center;'>"+
                    "<tr >"+
                            "<th></th>"+
                            "<th colspan='5'><p align='center'><font size='1'>"+estandar_terciario+" "+nombreViaTerciaria+"</font></p></th>"+
                        "</tr >"+						
                        "<tr>"+
                            "<th ><img  height='65' src='"+$scope.urlImagenes+"corte 1.png' width='30' /></th>"+
                            "<th style='height: 7px; transform: rotate(-90deg);'><font size='1'>Manzana Izqu<br>#"+numeroPredialIzquierdo+"</font></th>"+
                            "<th><img  height='65' src='"+$scope.urlImagenes+"manzana.png' width='30' /></th>"+
                            "<th>"+
                                "<table border='0' cellpadding='0' cellspacing='0' style='text-align: center;'>"+					
                                    "<tr>"+
                                        "<th style='height: 10px; width: 30px; transform: rotate(-90deg);'><font size='1'>"+estandar_principal+" "+nombreViaPrincipal+"</font></th>"+
                                    "</tr >"+
                                    "<th></th>"+
                                    "<tr>"+
                                        "<th align='center'><img  height='23' src='"+$scope.urlImagenes+"vista.png' width='20' /></th>"+	
                                    "</tr >"+
                                "</table>"+	
                            "</th>"+						
                            "<th><img  height='65' src='"+$scope.urlImagenes+"manzana2.png' width='30' /></th>"+
                            "<th style='height: 7px; transform: rotate(-90deg);'><font size='1'>Manzana Der<br>#"+numeroPredialDerecho+"</font></th>"+
                            "<th><img  height='65' src='"+$scope.urlImagenes+"corte 2.png' width='30' /></th>"+
                        "</tr>"+						
                        "<tr >"+
                            "<th></th>"+
                            "<th colspan='5'><p align='center'><font size='1'>"+estandar_secundario+" "+nombreViaSecundaria+"</font></p></th>"+
                        "</tr >"+
                    "</table>"+
                    "<table  align='center' width=100%>"+
                            "<tr><th style='text-align: left;'>Obs izquierda</th><th style='text-align: right;'>Obs derecha</th></tr>"+
                            "<tr><td style='text-align: left;'><div>"+observacionesizq+"</div></th>"+
                            "<td style='text-align: right;'><div>"+observacionesder+"</div></th></tr>"+
                            "<tr><th colspan='2' style='text-align: center;'>Observaciones generales:</th></tr>"+
                            "<tr><td colspan='2' style='text-align: left;'><div style='word-wrap: break-word; max-width:99%; width:99%; font-size:1'>"+observaciones+"</div></td></tr>"+
        
                    "</table> "+
                    "Estado: "+ estado + "<br>" +
                    "<input type='button' style='btn btn-success' ng-click='aprobarPerfil()' onclick=\"if (confirm('Esta seguro que desea aprobar este perfil?')) { \
                        $.ajax({ url: '"+$scope.root+"perfil/aprobarperfilporid/"+$scope.perfilId+"', type: 'POST', data: {  },  success: function (response) { alert(response);actualizarCapa(); } }); }\" value='Aprobar'/>"+
                    "<input type='button' style='btn btn-danger' onclick=\"window.open('../v2/#!/perfilvial/aprobarperfilvial/"+$scope.perfilId+"/1/revisar')\" value='Corregir'></input>"+
                    "</div>";
                });       
                return "<img id='loadingImg' src='http://saul.cali.gov.co/images/loader.gif' style='position:relative; left:50%; top:50%; z-index:100;' />"; 
            };

            
            view.popup.title = "Este es el texto";
            view.popup.content = "Prueba de Perfil";
            esriConfig.request.corsEnabledServers.push("https://planeacion.cali.gov.co/");
            function textcontent(id) {		
                var url = "https://planeacion.cali.gov.co/saul2/app_dev.php/perfilvial/"+id;
                 esriRequest(url,{responseType: 'json'}).then(function(response) {		
                    antejardin=JSON.stringify(response.data[0].antejardinIzquierdo,null,2);
                    anden=JSON.stringify(response.data[0].andenIzquierdo,null,2);
                    view.popupTemplate.content=view.popup.selectedFeature.attributes.id;
                });		
            };

            view.popup.on("trigger-action", function(event) {
                console.log("Evento",event);
                // Execute the measureThis() function if the measure-this action is clicked
                if (event.action.id === "streetview-this") {
                    console.log("entro a street view");
                    streetviewThis();
                }
            });

        });
    }
]);