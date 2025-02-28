// import("https://js.arcgis.com/4.8/");
saul.config(["$stateProvider", function(a) {
    a.state("mapa-b", {
        url: "/control-urbano/mapa-visitas",
        views: {
            main: {
                controller: "MapaVisitadorCtrl",
                templateUrl: "../bundles/VisitaBundle/mapaVisitador/mapaVisitador.tpl.html"
            }
        }
    })
}]).controller("MapaVisitadorCtrl", ["$scope","esriLoader", "root",   
    function($scope, esriLoader, root) {
        var self = this;
        self.viewLoaded = false;
        $scope.root = root;
        $scope.urlImagenes = "//saul.cali.gov.co/saul2/images/img_lineas/"; 
        $scope.imageStreetView = ""+$scope.urlImagenes+"street_view.png";
        $scope.urlGeoportal = "https://geoportal.cali.gov.co/agserver/rest/services/";                                 
        $scope.serviceLineas = "Lineas/lineas_auto/MapServer/0";
        $scope.controlPreventivo = "IDESC/seguridad_justicia_control_urbano/FeatureServer/5";
        $scope.controlPoterior = "IDESC/seguridad_justicia_control_urbano/FeatureServer/4";
        $scope.linkOrfeo = "https://www.cali.gov.co/aplicaciones/orweb/orweb/principal.php?id=";
        esriLoader.require([
            'esri/Map',
            'esri/views/MapView',
            'esri/layers/FeatureLayer',
            'esri/widgets/BasemapToggle',
            'esri/widgets/Search',
            'esri/config',
            'esri/request',
            "esri/widgets/Legend",
            "esri/widgets/LayerList",
            "esri/widgets/Expand",
            "esri/layers/MapImageLayer"
        ],function(Map, MapView, FeatureLayer, BasemapToggle, Search, esriConfig, esriRequest, MapImageLayer, Legend, LayerList, Expand)  {
            self.map = new Map({
                basemap: "streets"
            });

            // const mapImageLayer = new MapImageLayer({
            //     url: "https://geoportal.cali.gov.co/agserver/rest/services/CATASTRO/CATASTRO/MapServer"
            // });

            const mapImageLayer = new MapImageLayer({
                url: "https://geoportal.cali.gov.co/agserver/rest/services/CATASTRO/CATASTRO/MapServer",
                visible: true,
                sublayers: [
                    {
                        id: 0,
                        title: "Anexos",
                        visible: false
                    },
                    {
                        id: 1,
                        title: "Construcciones",
                        visible: false
                    },
                    {
                        id: 2,
                        title: "Terreno",
                        popupTemplate: popupCatastro,
                        visible: true
                    }
                ]
            });
            map.add(mapImageLayer);


            const popupCatastro = {
                title: "Información de Catastro",
                content: "<b>NPN_TERRENO:</b> {NPN_TERRENO}<br><b>Matricula Inmobiliaria:</b> {NUM_MATRINMO}"
            };
            
            const popupSolicitud = {
            title: "Solicitudes",
            content:
              "<b>ID:</b> {vcgid}<br><b>Radicado de Entrada:</b> <a href="+$scope.linkOrfeo+"{vcgrdsol}>{vcgrdsol}</a></><br><b>NPN:</b> {vcgnpn}<br><b>Radicado de salida:</b> {vcgrdsal}"
          };
            const popupAntenas = {
            title: "Visitas Control Antenas",
            content:
              "<b>ID:</b> {vcgid}<br><b>Radicado de Entrada:</b> <a href=\""+$scope.linkOrfeo+"{vcgrdsol}\" target=\"_blank\">{vcgrdsol}</a><br><b>NPN:</b> {vcgnpn}<br><b>Radicado de salida:</b> <a href=\""+$scope.linkOrfeo+"{vcgrdsal}\" target=\"_blank\">{vcgrdsal}</a>"
          };
          const popupLioep = {
            title: "Visita Control LIOEP",
            content:
              "<b>ID:</b> {vcgid}<br><b>Radicado de Entrada:</b> <a href=\""+$scope.linkOrfeo+"{vcgrdsol}\" target=\"_blank\">{vcgrdsol}</a><br><b>NPN:</b> {vcgnpn}<br><b>Radicado de salida:</b> <a href=\""+$scope.linkOrfeo+"{vcgrdsal}\" target=\"_blank\">{vcgrdsal}</a>"
          };
          const popupOrnato = {
            title: "Visita Control Ornato",
            content:
              "<b>ID:</b> {vcgid}<br><b>Radicado de Entrada:</b> <a href=\""+$scope.linkOrfeo+"{vcgrdsol}\" target=\"_blank\">{vcgrdsol}</a><br><b>NPN:</b> {vcgnpn}<br><b>Radicado de salida:</b> <a href=\""+$scope.linkOrfeo+"{vcgrdsal}\" target=\"_blank\">{vcgrdsal}</a>"
          };
          const popupPosterior = {
            title: "Visita Control Posterior",
            content:
              "<b>ID:</b> {vcgid}<br><b>Radicado de Entrada:</b> <a href=\""+$scope.linkOrfeo+"{vcgrdsol}\" target=\"_blank\">{vcgrdsol}</a><br><b>NPN:</b> {vcgnpn}<br><b>Radicado de salida:</b> <a href=\""+$scope.linkOrfeo+"{vcgrdsal}\" target=\"_blank\">{vcgrdsal}</a>"
          };
          const popupPreventivo = {
            title: "Visita Control Preventivo",
            content:
              "<b>ID:</b> {vcgid}<br><b>Radicado de Entrada:</b> <a href=\""+$scope.linkOrfeo+"{vcgrdsol}\" target=\"_blank\">{vcgrdsol}</a><br><b>NPN:</b> {vcgnpn}<br><b>Radicado de salida:</b> <a href=\""+$scope.linkOrfeo+"{vcgrdsal}\" target=\"_blank\">{vcgrdsal}</a>"
          };
            const solicitudesLayer = new FeatureLayer({
                url: "https://geoportal.cali.gov.co/agserver/rest/services/IDESC/seguridad_justicia_control_urbano/FeatureServer/0",
                title: "Solicitudes",
                visible: false,
                outFields: ["vcgid", "vcgrdsol", "vcgnpn", "vcgrdsal"],
                popupTemplate: popupSolicitud
            });

            const antenasLayer = new FeatureLayer({
                url: "https://geoportal.cali.gov.co/agserver/rest/services/IDESC/seguridad_justicia_control_urbano/FeatureServer/1",
                title: "Visitas Control Anternas",
                visible: false,
                outFields: ["vcgid", "vcgrdsol", "vcgnpn", "vcgrdsal"],
                popupTemplate: popupAntenas
               
            });

            const lioepLayer = new FeatureLayer({
                url: "https://geoportal.cali.gov.co/agserver/rest/services/IDESC/seguridad_justicia_control_urbano/FeatureServer/2",
                title: "Visitas Control LIOEP: ",
                visible: false,
                outFields: ["vcgid", "vcgrdsol", "vcgnpn", "vcgrdsal"],
                popupTemplate: popupLioep
            });

            const ornatoLayer = new FeatureLayer({
                url: "https://geoportal.cali.gov.co/agserver/rest/services/IDESC/seguridad_justicia_control_urbano/FeatureServer/3",
                title: "Visitas Control Ornato",
                visible: false,
                outFields: ["vcgid", "vcgrdsol", "vcgnpn", "vcgrdsal"],
                popupTemplate: popupOrnato
            });

            const posteriorLayer = new FeatureLayer({
                url: "https://geoportal.cali.gov.co/agserver/rest/services/IDESC/seguridad_justicia_control_urbano/FeatureServer/4",
                title: "Visitas Control Posterior",
                visible: false,
                outFields: ["vcgid", "vcgrdsol", "vcgnpn", "vcgrdsal"],
                popupTemplate: popupPosterior
            });

            const preventivoLayer = new FeatureLayer({
                url: "https://geoportal.cali.gov.co/agserver/rest/services/IDESC/seguridad_justicia_control_urbano/FeatureServer/5",
                title: "Visitas Control Preventivo",
                visible: false,
                outFields: ["vcgid", "vcgrdsol", "vcgnpn", "vcgrdsal"],
                popupTemplate: popupPreventivo
            });

        
            // map.add(mapImageLayer);
            self.map.add(solicitudesLayer);
            self.map.add(ornatoLayer);
            self.map.add(posteriorLayer);
            self.map.add(preventivoLayer);
            self.map.add(antenasLayer);
            self.map.add(lioepLayer);

            const view = new MapView({
                container: "viewDiv",
                map: self.map,
                center: [-76.5225, 3.4216], // Coordenadas de Santiago de Cali
                zoom: 12
            });

            const legend = new Legend({
                view: view
            });

            

            const searchWidget = new Search({
                view: view,
                allPlaceholder: "Buscar en capas",
                includeDefaultSources: false,
                sources: [
                    
                    {
                        layer: antenasLayer,
                        searchFields: ["vcgrdsol"],
                        displayField: "Radicación",
                        exactMatch: false,
                        outFields: ["*"],
                        name: "Visitas Control Antenas",
                        placeholder: "Buscar en Visitas Control Antenas"
                    },
                    {
                        layer: lioepLayer,
                        searchFields: ["vcgrdsol"],
                        displayField:  "Radicación",
                        exactMatch: false,
                        outFields: ["*"],
                        name: "Visitas Control LIOEP",
                        placeholder: "Buscar en Visitas Control LIOEP"
                    },
                    {
                        layer: ornatoLayer,
                        searchFields: ["vcgrdsol"],
                        displayField:  "Radicación",
                        exactMatch: false,
                        outFields: ["*"],
                        name: "Visitas Control Ornato",
                        placeholder: "Buscar en Visitas Control Ornato"
                    },
                    {
                        layer: posteriorLayer,
                        searchFields: ["vcgrdsol"],
                        displayField:  "Radicación",
                        exactMatch: false,
                        outFields: ["*"],
                        name: "Visitas de Control Posterior",
                        placeholder: "Buscar en Visitas de Control Posterior"
                    },
                    {
                        layer: preventivoLayer,
                        searchFields: ["vcgrdsol"],
                        displayField:  "Radicación",
                        exactMatch: false,
                        outFields: ["*"],
                        name: "Visitas Control Preventivo",
                        placeholder: "Buscar en Visitas Control Preventivo"
                    }
                ]
            });

            const legendExpand = new Expand({
                view: view,
                content: legend,
                expanded: false
            });
              
            const layerList = new LayerList({
                view: view,
                index: 0
            });

            // view.ui.add(layerList, "top-right");
            // view.ui.add(legendExpand, "bottom-left");            
            view.ui.add(searchWidget, "top-left");
       

            /** Inicio de Toggle de Capas */
            var posteriorToggle = document.getElementById("posteriorCheck");            
            posteriorToggle.addEventListener("change", function() {
                posteriorLayer.visible = posteriorToggle.checked;
            }); 
            var preventivoToggle = document.getElementById("preventivoCheck");            
            preventivoToggle.addEventListener("change", function() {
                preventivoLayer.visible = preventivoToggle.checked;
            });   
            var ornatoToggle = document.getElementById("ornatoCheck");            
            ornatoToggle.addEventListener("change", function() {
                ornatoLayer.visible = ornatoToggle.checked;
            });
            var ornatoToggle = document.getElementById("ornatoCheck");            
            ornatoToggle.addEventListener("change", function() {
                ornatoLayer.visible = ornatoToggle.checked;
            });                  
            /** Fin de Toggle de Capas */

           
            
        });
    }
]);