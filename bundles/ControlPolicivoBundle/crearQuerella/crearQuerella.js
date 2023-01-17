saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlpolicivo-crearquerella", {
            url: "/controlpolicivo/crearquerella",
            views: {
                "main": {
                    controller: "ControlPolicivoCrearQuerellaCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/crearQuerella/crearQuerella.tpl.html"
                }
            }
        }); 
    }
]).controller("ControlPolicivoCrearQuerellaCtrl", ["$scope", "root", "urlPlugInNomenclatura", "Hora", "Tercero", "Comuna", "Corregimiento","TipoDocIdentificacion", "Ciudad", "ComportamientoContrario", "dsJqueryUtils", "Upload",
    function ($scope, root, urlPlugInNomenclatura, Hora, Tercero, Comuna, Corregimiento, TipoDocIdentificacion, Ciudad, ComportamientoContrario, dsJqueryUtils, Upload) {        
        $scope.querella = {};        
        $scope.ocultarModal = true;        
        $scope.modalOpen = false;                
        $scope.comunas = Comuna.query();
        $scope.corregimientos = Corregimiento.query();
        Hora.query().$promise.then( function (result) {
            $scope.querella.hora = result.hora;
        });
        $scope.arrayTipoDocIdentificacion = TipoDocIdentificacion.query();
                
        $scope.onSelect = function ($item, $model, $label) {            
            $scope.$item = $item;
            $scope.$model = $model;
            $scope.$label = $label;
        };
        
        $scope.hideAlert = function () {
            $scope.validator = {};
        };        
                

        //files 
        $scope.files = [];
        $scope.$on("fileSelected", function (event, args) {
            $scope.$apply(function () {
                $scope.files.push(args.file);
            });
        });
        //files

        $scope.getComportamientosContrarios = function (viewValue) {      
            return ComportamientoContrario.query({"clave": viewValue}).
                $promise.then(function (response) {
                    if (response.length == 0) {
                       console.log("no encontró resultados");
                    }
                    return response.map(function (item) {                        
                        return item;
                    });
                });
        };

        $scope.getCiudades = function (viewValue) {      
            return Ciudad.query({"clave": viewValue}).
                $promise.then(function (response) {
                    if (response.length == 0) {
                       console.log("no encontró resultados");
                    }
                    return response.map(function (item) {                        
                        return item;
                    });
                });
        };

        $scope.getSolicitante = function (viewValue) {      
            return Tercero.query({"clave": viewValue}).
                $promise.then(function (response) {
                    return response.map(function (item) {   
                        $scope.querella.solicitante = item;
                        return item;
                    });
                });
        }; 
        
         $scope.getSolicitanteRepresentante = function (viewValue) {      
            return Tercero.query({"clave": viewValue}).
                $promise.then(function (response) {
                    return response.map(function (item) {   
                        $scope.querella.solicitante.representante = item;
                        return item;
                    });
                });
        }; 
        
        $scope.getInfractor = function (viewValue) {      
            return Tercero.query({"clave": viewValue}).
                $promise.then(function (response) {
                    return response.map(function (item) {   
                        $scope.querella.infractor = item;
                        return item;
                    });
                });
        }; 
        
         $scope.getInfractorRepresentante = function (viewValue) {      
            return Tercero.query({"clave": viewValue}).
                $promise.then(function (response) {
                    return response.map(function (item) {   
                        $scope.querella.infractor.representante = item;
                        return item;
                    });
                });
        }; 
        
        $scope.obtenerModalIngresoDireccionSolicitante = function() {
            $.ajax({
                url: urlPlugInNomenclatura,
                data: {
                    fieldNamecallbackFunction: "cerrarModal",
                    fieldNameNPNrequerido: !1,
                    activarBusqueda: false,
                    fieldNameDiv: "modalIngresoDireccion",
                    fieldNameNumeroUnico: "NPN",
                    fieldNameDireccion: "BusquedaDireccion",
                    fieldNameDireccionVisual: "direccionVisualSolicitante",
                    fieldNameDireccionAdicional: "informacionAdicionalSolicitante"
                },
                success: function(a) {
                    $("#modalIngresoDireccion").empty(), $("#modalIngresoDireccion").append(a), $("#modalIngresoDireccion").modal("show")
                }
            })
        };
        
        $scope.obtenerModalIngresoDireccionRepresentanteSolicitante = function() {
            $.ajax({
                url: urlPlugInNomenclatura,
                data: {
                    fieldNamecallbackFunction: "cerrarModal",
                    fieldNameNPNrequerido: !1,
                    activarBusqueda: false,
                    fieldNameDiv: "modalIngresoDireccion",
                    fieldNameNumeroUnico: "NPN",
                    fieldNameDireccion: "BusquedaDireccion",
                    fieldNameDireccionVisual: "direccionVisualRepresentanteSolicitante",
                    fieldNameDireccionAdicional: "informacionAdicionalRepresentanteSolicitante"
                },
                success: function(a) {
                    $("#modalIngresoDireccion").empty(), $("#modalIngresoDireccion").append(a), $("#modalIngresoDireccion").modal("show")
                }
            })
        };
        
        $scope.obtenerModalIngresoDireccionInfractor = function() {
            $.ajax({
                url: urlPlugInNomenclatura,
                data: {
                    fieldNamecallbackFunction: "cerrarModal",
                    fieldNameNPNrequerido: false,                    
                    fieldNameDiv: "modalIngresoDireccion",
                    fieldNameNumeroUnico: "NPN",                    
                    fieldNameDireccionVisual: "direccionVisualInfractor",
                    fieldNameDireccionAdicional: "informacionAdicionalInfractor"
                },
                success: function(a) {
                    $("#modalIngresoDireccion").empty(), $("#modalIngresoDireccion").append(a), $("#modalIngresoDireccion").modal("show")
                }
            })
        };
        
        $scope.obtenerModalIngresoDireccionRepresentanteInfractor = function() {
            $.ajax({
                url: urlPlugInNomenclatura,
                data: {
                    fieldNamecallbackFunction: "cerrarModal",
                    fieldNameNPNrequerido: false,                    
                    fieldNameDiv: "modalIngresoDireccion",
                    fieldNameNumeroUnico: "NPN",
                    fieldNameDireccion: "BusquedaDireccion",
                    fieldNameDireccionVisual: "direccionVisualRepresentanteInfractor",
                    fieldNameDireccionAdicional: "informacionAdicionalRepresentanteInfractor"
                },
                success: function(a) {
                    $("#modalIngresoDireccion").empty();
                    $("#modalIngresoDireccion").append(a);
                    $("#modalIngresoDireccion").modal("show");                    
                }
            })
        };
        
        $scope.obtenerModalIngresoDireccionQuerella = function() {
            $.ajax({
                url: urlPlugInNomenclatura,
                data: {
                    fieldNamecallbackFunction: "cerrarModal",
                    fieldNameNPNrequerido: false,
                    activarBusqueda: 1,
                    fieldNameDiv: "modalIngresoDireccion",
                    fieldNameNumeroUnico: "NPN",
                    fieldNameDireccion: "direccionHechos",
                    fieldNameDireccionVisual: "direccionHechosVisual",
                    fieldNameDireccionAdicional: "informacionAdicionalHechos"
                },
                success: function(a) {
                    $("#modalIngresoDireccion").empty();
                    $("#modalIngresoDireccion").append(a);
                    $("#modalIngresoDireccion").modal("show");
                    $scope.querella.direccion = $("#direccionHechos").value();
                }
            })
        };
                
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


        function validateSave() { 
            var validator = {};
            if ($scope.lugar_es_rural==1) {
                $scope.querella.idcomuna = null;
                if(!$scope.querella.idcorregimiento) {
                    $scope.validator.idcorregimiento = "Seleccione un corregimiento";
                }                
            }
            if ($scope.lugar_es_rural!=1) {
                $scope.querella.idcorregimiento = null;
                if(!$scope.querella.idcomuna) {
                    validator.idcomuna = "Seleccione una comuna";
                }                
            }   
            if(!$scope.querella.direccion) {
                validator.direccionHechos = "ingrese una dirección";
            }
            console.log(validator);
            $scope.validator = validator;
            return $.isEmptyObject(validator);
        };
        
        $scope.save = function () 
        {            
            $scope.querella.informacionAdicional = '';
            if($scope.solicitante_es_rural !== true) {
                $scope.querella.direccion = document.getElementById('direccionHechos').value;
                $scope.querella.informacionAdicional = document.getElementById('informacionAdicionalHechos').value;
            }
            var validate = validateSave();
            if (validate) {                         
                dsJqueryUtils.goTop();
                Upload.upload({
                    url: root+'controlpolicivo/querella',
                    data: {
                        data: $scope.querella,
                        files: $scope.files
                    }
                }).then(function (response) {
                    $scope.result = response.data;
                    callback(response.data);
                    if (response.data.success) {
                        
                    }
                });
            } 
        };

        $scope.cancel = function () {
        };
    }
]);
