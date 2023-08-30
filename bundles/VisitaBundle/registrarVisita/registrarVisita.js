saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("registrar-visita", {
            url: "/visita/generar/:idVisita",
            views: {
                "main": {
                    controller: "RegistrarVisitaCtrl",
                    templateUrl: "../bundles/VisitaBundle/registrarVisita/registrarVisita.tpl.html"
                }
            }
        });
    }
]).directive('dateInput', function(){
    return {
        restrict : 'A',
        scope : {
            ngModel : '='
        },
        link: function (scope) {
            if (scope.ngModel) scope.ngModel = new Date(scope.ngModel);
        }
    }
}).directive('stringToNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (value) {
                return '' + value;
            });
            ngModel.$formatters.push(function (value) {
                return parseFloat(value);
            });
        }
    };
}).config(["$httpProvider", function ($httpProvider) {
        $httpProvider.defaults.transformResponse.push(function (responseData) {
            convertDateStringsToDates(responseData);
            return responseData;
        });
    }]).controller("RegistrarVisitaCtrl", ["$scope", "$http","root", "$stateParams", "Visita", "EncabezadoVisita", "TipoSolicitud", "FormularioVisita", "Visitaxdocumento","dsJqueryUtils", "Upload", "$timeout", "$state", "ComportamientoContrario", "esriLoader",
    function ($scope, $http, root, $stateParams, Visita, EncabezadoVisita, TipoSolicitud, FormularioVisita, Visitaxdocumento, dsJqueryUtils, Upload, $timeout, $state, ComportamientoContrario, esriLoader) {
        var self = this;
        $scope.datavisita = [];
        self.viewLoaded = false;
        $scope.root = root;
        $scope.viewLoaded = false;
        $scope.urlImagenes = "//planeacion.cali.gov.co/saul2/images/img_lineas/";
        $scope.imageStreetView = ""+$scope.urlImagenes+"street_view.png";
        $scope.urlGeoportal = "https://geoportal.cali.gov.co/agserver/rest/services/Lineas/lineas_auto/MapServer/0";                               
        $scope.visita = {};
        $scope.files = {};
        
        $scope.inputFiles = {}; 
        
        $scope.root = root;
        $scope.visita.idVisita = $stateParams.idVisita;
        $scope.ocultarModal = true;
        $(".overlap_espera").show();
        $(".overlap_espera_1").show();
        
        //Búsqueda de la visita
        Visita.find({id: $stateParams.idVisita}).$promise.then(function (response) {
            $scope.visita = response;
            $scope.datavisita.longitud = response.longitud;
            $scope.datavisita.latitud = response.latitud;
            // $scope.agregarLocalizacion($scope.datavisita.longitud,$scope.datavisita.latitud);
            $scope.camposformularioVisita = FormularioVisita.query({id: $stateParams.idVisita});
            EncabezadoVisita.query({id: $stateParams.idVisita}).$promise.then(function(response) {
                $scope.camposLectura = response;
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear"); 
            });
            $scope.expediente = "";
        });
        
        // esriLoader.require([
        //     'esri/Map',
        //     'esri/views/MapView',
        //     'esri/layers/FeatureLayer',
        //     'esri/widgets/BasemapToggle',
        //     'esri/widgets/Search',
        //     'esri/config',
        //     'esri/request',
        //     "esri/Graphic","esri/geometry/Point",
        //     "esri/symbols/SimpleMarkerSymbol", "esri/Color", "dojo/dom", "dojo/domReady!",
        // ],function(Map, MapView, FeatureLayer, BasemapToggle, Search, esriConfig, esriRequest,  Graphic, Point, SimpleMarkerSymbol,
        //     Color, dom){

        //     //Definición del Mapa
        //     self.map = new Map({
        //         basemap: 'streets',
        //         basemap: "topo"
        //     });

        //     //Definición del MapView
        //     view = new MapView({
        //         container: "viewDiv",
        //         map: self.map,
        //         zoom: 13,
        //         center: [-76.52,3.435],
        //         highlightOptions: {
        //             color: [255,241,58],
        //             fillOpacity:0.4
        //         },
        //         popup: {
        //             actionsMenuEnabled: false                    
        //               }
        //     });
               

        //     //Definición de BasemapToggle
        //     var toggle = new BasemapToggle({
        //         view: $scope.view,
        //         nextBasemap: "hybrid"
        //     });
        //     view.ui.add(toggle, "bottom-right");
            
            
        //     //Búsqueda por dirección y prediales
		// 	var predios_urbanos = new FeatureLayer({
        //         url: "https://geoportal.cali.gov.co/agserver/rest/services/Lineas/predial_idesc/FeatureServer/0",
        //         title: "predios",
        //         minScale: 1,
        //         outFields: ["*"]
        //     });
        //     var predios_rurales = new FeatureLayer({
        //         url: "https://geoportal.cali.gov.co/agserver/rest/services/Lineas/predial_idesc/FeatureServer/1",
        //         title: "predios",
        //         minScale: 1,
        //         outFields: ["*"]
                
        //     });
        //     var searchWidget = new Search({
        //         view: view,
        //         allPlaceholder: "Todos los criterios",
        //         sources: [
        //             {
        //             layer: predios_urbanos,
        //             searchFields: ["numepred","npn"],
        //             displayField: "numepred",
        //             exactMatch: false,
        //             outFields: ["*"],
        //             name: "Número predial urbano",
        //             zoomScale: 100000,
        //             placeholder: "F038600080000"
        //             },
        //             {
        //             layer: predios_rurales,
        //             name: "Número predial rural",
        //             zoomScale: 100000,
        //             displayField: "numepred",
        //             searchFields: ["numepred", "npn"],
        //             exactMatch: false,
        //             outFields: ["*"],
        //             placeholder: "Y000700820001"
        //             }
        //         ]
        //     });
        //     view.ui.add(searchWidget, {
        //        position: "top-left"
        //     });
            
              
        //     //when the map is clicked create a buffer around the click point of the specified distance.
        //     view.on("click", function(evt){
        //         $scope.datavisita.longitud = evt.mapPoint.longitude.toString();
        //         $scope.datavisita.latitud = evt.mapPoint.latitude.toString();
        //         view.graphics.removeAll();
        //         $scope.agregarLocalizacion(evt.mapPoint.longitude.toString(),evt.mapPoint.latitude.toString());
        //     });
            
            
        //     $scope.agregarLocalizacion = function(longitud, latitud) {
        //         if(longitud && latitud) {
        //             console.log(longitud);
        //             view.graphics.removeAll();
        //             var pt = new Point({
        //                 latitude: latitud,
        //                 longitude: longitud 
        //             });
        //             //point for address popup information
        //             var ptAtt = {
        //                 Title: "Home",
        //                 Name: "The Seifert's",
        //                 Owner: "Christine Seifert"
        //             };
        //             // symbol for point 
        //             var sym = new SimpleMarkerSymbol({
        //                 color: [0,108,153],
        //                 style: "circle",
        //                 size: 12
        //             });
                    
        //             var ptGraphic = new Graphic({
        //                 geometry: pt,
        //                 symbol: sym,
        //                 attributes: ptAtt,
        //                 popupTemplate:{
        //                   title: "{Title}",
        //                   content: [{
        //                     type:"fields",
        //                     fieldInfos:[{
        //                       fieldName: "Name"
        //                     },{
        //                       fieldName: "Owner"
        //                     }]
        //                   }]
        //               }
        //             });
        //             view.graphics.add(ptGraphic);    
        //         }
        //     }

        //     // $scope.agregarLocalizacion($scope.datavisita.longitud,$scope.datavisita.latitud);
        // });
        
        $scope.direccion ="";
        // Visitaxdocumento.query({id: $stateParams.idVisita}).$promise.then(function (response) {            
        //     $scope.visitasxdocumento = response;
        // });
        $scope.isReadOnly = false;
        $scope.tiposSolicitud = TipoSolicitud.query();

        $scope.tipoSolicitud = {};
        $scope.oculto = true;
        $scope.isSuccess = false;
        $scope.arrayDominio = [];

        $scope.hideAlert = function () {
            $scope.validator = {};
            
        };
        
        $scope.getDateValue = function(dateString) {
            try {
                var date = new Date(dateString);
            } catch (exception) {
                var date = new Date();
            }
            if(date = 'Invalid Date') {
                date = null
            }
            return date;
        }

        $scope.getDominio = function(nombreDominio, valor) {
            // LoadingOverlap.show($scope);
            $http.get(root+"dominio/"+nombreDominio).then(function(response) {
                $scope.arrayDominio[nombreDominio] = response.data;
            }).finally(function(){
                // LoadingOverlap.hide($scope);
            });
            
        }
        
        $scope.changeSelect = function(nombreDominio) {
            alert('changeSelect');
            return $scope.arrayDominio[nombreDominio][0];
            // $scope.selectedId = $scope.selectedItem && $scope.selectedItem.id
         }
        
        function callback(data) {
            $scope.validator = {};
            $scope.validator.alert = {};
            $scope.validator.alert.title = data.title;
            $scope.validator.alert.content = data.msg;
            $scope.validator.alert.type = data.type;
            $("html, body").animate({
                scrollTop: 0
            }, "slow", "swing");
        }
        ;

        //files
        $scope.files = [];
        $scope.$on("fileSelected", function (event, args) {
            $scope.$apply(function () {
                $scope.files.push(args.file);
            });
        });
        //files
        
        $scope.saveItem = function(input) {
            if(input !== undefined) {
                $scope.valoresFormulario = [];
                $scope.valoresFormulario.push({codigo: input.codigo, valor: input.valor, tipoItem: input.tipoItem});
                Upload.upload({
                    url: root + 'visita',
                    data: {
                        idVisita: $scope.visita.idVisita,
                        data: $scope.valoresFormulario
                    }
                }).then(function (response) {
                    
                }, function(MessageChannel) {
                    alert("Ha ocurrido un error informe al desarrollador. Gracias.");
                });
            }
        }

        
        $scope.save = function (finalizar) {
            $scope.valoresFormulario = [];
            angular.forEach($scope.camposformularioVisita, function (campo) {
                angular.forEach(campo.arrayItems, function (arrayItem) {
                    angular.forEach(arrayItem.item.items, function (item) {
                        if (item.valor !== null && item.valor !== '' && item.valor !== 'null' && item.soloLectura === 0) {
                            $scope.valoresFormulario.push({codigo: item.codigo, valor: item.valor, tipoItem: item.tipoItem});
                        }
                    });
                });
            });
            console.log($scope.valoresFormulario);
            if (true) {
                $(".overlap_espera").show();
                $(".overlap_espera_1").show();
                Upload.upload({
                    url: root + 'visita',
                    data: {
                        idVisita: $scope.visita.idVisita,
                        data: $scope.valoresFormulario,
                        visita: $scope.datavisita,
                        finalizar: finalizar,
                        files: $scope.inputFiles
                    }
                }).then(function (response) {
                    console.log("aqui no hay error2");
                    $(".overlap_espera").fadeOut(500, "linear");
                    $(".overlap_espera_1").fadeOut(500, "linear"); 
                    $scope.result = response.data;
                    callback(response.data);
                    if (response.data.success) {
                        $scope.asignacion = {};
                    }
                    $scope.isSuccess = true;
//                    $timeout(function () {
//                        $state.go('listar-visita');
//                    }, 3000);
                });
            } else {
                dsJqueryUtils.goTop();
            }
        };
        

        $scope.cancel = function () {
        };
    }
]);


var regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;

function convertDateStringsToDates(input) {
    // Ignore things that aren't objects.
    if (typeof input !== "object")
        return input;

    for (var key in input) {
        if (!input.hasOwnProperty(key))
            continue;

        var value = input[key];
        var match;
        // Check for string properties which look like dates.
        // TODO: Improve this regex to better match ISO 8601 date strings.
        if (typeof value === "string" && (match = value.match(regexIso8601))) {
            // Assume that Date.parse can parse ISO 8601 strings, or has been shimmed in older browsers to do so.
            var milliseconds = Date.parse(match[0]);
            if (!isNaN(milliseconds)) {
                input[key] = new Date(milliseconds);
            }
        } else if (typeof value === "object") {
            // Recurse into object
            convertDateStringsToDates(value);
        }
    }
}

