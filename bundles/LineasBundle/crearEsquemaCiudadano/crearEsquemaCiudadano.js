saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("crear-peticion-esquemas-ciudadano", {
            url: "/esquemabasico/solicitudciudadano",
            views: {
                "main": {
                    controller: "CrearPeticionEsquemaCiudadanoCtrl as vm",
                    templateUrl: "../bundles/LineasBundle/crearEsquemaCiudadano/crearEsquemaCiudadano.tpl.html",
                }
            },
        })
    }
]).controller("CrearPeticionEsquemaCiudadanoCtrl", ["$scope", "root", "NgMap", "urlPlugInNomenclatura", "Barrio", "dsJqueryUtils", "Upload",
    function ($scope, root, NgMap, urlPlugInNomenclatura, Barrio, dsJqueryUtils, Upload) {
        $scope.step = 1;
        $scope.peticion = {};
        $scope.root = root;
        $scope.saveButton = true;
        $scope.ocultarModal = true;
        $scope.modalOpen = false;

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

        //*********************************************
        //**          Autocomplete Barrios           **
        //*********************************************
        $scope.getBarrios = function (viewValue) {
            return Barrio.query({"clave": viewValue}).
                    $promise.then(function (response) {
                        if (response.length == 0) {
                            console.log("no encontró resultados");
                        }
                        return response.map(function (item) {
                            return item;
                        });
                    });
        };

        //*********************************************
        //**           Plugin Nomenclatura           **
        //*********************************************
        $scope.obtenerModalIngresoDireccion = function () {
            $.ajax({
                url: urlPlugInNomenclatura,
                data: {
                    fieldNamecallbackFunction: "cerrarModal",
                    fieldNameNPNrequerido: true,
                    activarBusqueda: !0,
                    fieldNameDiv: "modalIngresoDireccion",
                    fieldNameNumeroUnico: "NPN",
                    fieldNameDireccion: "BusquedaDireccion",
                    fieldNameDireccionVisual: "BusquedaDireccion2",
                    fieldNameDireccionAdicional: "BusquedaInformacionAdicional"
                },
                success: function (data) {
                    $('#modalIngresoDireccion').empty();
                    $('#modalIngresoDireccion').append(data);
                    $('#modalIngresoDireccion').modal('show');
                }
            });
        };


        //******************************************
        //**       Tratamiento de Archivos
        //******************************************
        $scope.files = [];
        $scope.$on("fileSelected", function (event, args) {
            $scope.$apply(function () {
                $scope.files.push(args.file);
            });
        });
        $scope.deleteFile = function (idx) {
            var file = $scope.files[idx];
            if (file.isUploaded) {
                $http.delete('/api/files/' + file.id).then(function (response) {
                    if (response.status == 200) {
                        $scope.files.splice(idx, 1);
                    }
                });
            } else {
                $scope.files.splice(idx, 1);
            }
        };
        //********************************************
        //**           Mapa Google Api              **
        //********************************************
        $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyA-qFUenAQDsYtGBLpyh2z-_GIIghTWzxw";
        $scope.llamar = function () {           
        }
        NgMap.getMap().then(function (map) {
            var markers = [];
            
            map.addListener('click', function (event) {
                addMarker(event.latLng);
            });
            
            function setMapOnAll(map) {
                for (var i = 0; i < markers.length; i++) {
                    markers[i].setMap(map);
                }
            }

            function addMarker(location) {                
                
                $scope.peticion.latitud = location.lat();
                $scope.peticion.longitud = location.lng();                
                setMapOnAll(null);
                var marker = new google.maps.Marker({
                    position: location,
                    map: map
                });
                markers[0] = marker;              
            }
        });


        //********************************************
        //**          Almacenamiento                **
        //********************************************
        $scope.save = function ()
        {            
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
            $scope.saveButton = false;
            var files = $scope.files;
            dsJqueryUtils.goTop();
            Upload.upload({
                url: root + 'esquemanbasico/solicitudciudadanotest',
                data: {
                    data: $scope.peticion,
                    files: files
                }
            }).then(function (response) {
                $scope.saveButton = true;
                callback(response.data);
                if (response.data.success) {
                    $scope.peticion = {};
                    $scope.files = [];
                }
                $scope.saveButton = true;
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
            }, function (response) {
                if (response.status > 0) {
                    $scope.errorMsg = response.status + ': ' + response.data;
                }
            }, function (evt) {
                $scope.progress =
                        Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.ocultarModal = false;
        };

    }
]);
