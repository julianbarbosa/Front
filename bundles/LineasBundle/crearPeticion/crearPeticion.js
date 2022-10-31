saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("crear-peticion-lineas", {
            url: "/lineademarcacion/solicitud",
            views: {
                "main": {
                    controller: "CrearPeticionLineasCtrl",
                    templateUrl: "../bundles/LineasBundle/crearPeticion/crearPeticion.tpl.html"
                }
            }
        });
    }
]).controller("CrearPeticionLineasCtrl", ["$scope", "root", "urlPlugInNomenclatura", "Nomenclatura", "Comuna", "Barrio", "Predio", "Usuario", "dsJqueryUtils", "$uibModal", "Upload",
    function ($scope, root, urlPlugInNomenclatura, Nomenclatura, Comuna, Barrio, Predio, Usuario, dsJqueryUtils, $uibModal, Upload) {        
        $scope.peticion = {};
        $scope.peticion.usuario= {};
        $scope.root = root;
        $scope.saveButton = true;
        $scope.ocultarModal = true;        
        $scope.modalOpen = false;                
        $scope.comunas = Comuna.query();
        $scope.peticion.zona_predio = 1;
        $scope.tiposIdentificacion = [{ id: 1, name: 'Cédula' },{ id: 2, name: 'NIT' }];
        $scope.options = {maskDefinitions: {'Z': /[a-zA-ZñÑ]/}};
        
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

        $scope.getPredios = function (viewValue)
        {
            return Predio.query({"key": viewValue}).
            $promise.then(function (response) {
                if (response.length === 0) {
                    $scope.peticion.tipo_busqueda = 1;
                    $scope.peticion.predio = '';
                    obtenerModalIngresoDireccion();
                }
                return response.map(function (item) {
                    return item;
                });
            });
        };

        $scope.getNomenclaturas = function (viewValue)
        {
            return Nomenclatura.query({"key": viewValue}).
            $promise.then(function (response) {
                if (response.length == 0) {
                    obtenerModalIngresoDireccion();
                }
                return response.map(function (item) {
                    return item;
                });
            });
        };

        $scope.getUsuarios = function (viewValue)
        {
            $scope.iniciarEspera(); 
            $scope.peticion.usuario = {numidentificacion:viewValue};
            return Usuario.query({"key": viewValue})
                .$promise
                .then(function (response) {
                return response.map(function (item) {                                     
                    $scope.peticion.usuario = item;
                    $scope.finalizarEspera();
                    return item;
                });                
            }).finally(function(data){     
                $scope.finalizarEspera();
            });
        };
        
        $scope.abrirModal = function() {
            $scope.modalOpen=true;
            $scope.newModalUsuario($scope);
        };

        $scope.obtenerModalIngresoDireccion = function() {
            $.ajax({
                url: urlPlugInNomenclatura,
                data: { 
                    fieldNamecallbackFunction: "cerrarModal", 
                    fieldNameNPNrequerido: true,
                    activarBusqueda: !0,
                    fieldNameDiv: "modalIngresoDireccion", 
                    fieldNameNumeroUnico: "NPN", 
                    fieldNameDireccion: "BusquedaDireccionVisual", 
                    fieldNameDireccionVisual: "BusquedaDireccionVisual",
                    fieldNameDireccionAdicional: "BusquedaInformacionAdicional"
                },
                success: function (data) {
                    console.log("data=>"+data);
                    $('#modalIngresoDireccion').empty();
                    $('#modalIngresoDireccion').append(data);
                    $('#modalIngresoDireccion').modal('show');
                }
            });
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
        };

        function validateLineas2Save() {
            if(angular.isUndefined($scope.peticion.codigo_unico) ) {
                $scope.peticion.codigo_unico = document.getElementById('NPN').value;
            }            
            var validator = {},
                    peticion = $scope.peticion;
            if (peticion.usuarioanonimo!==true) {
                if (!peticion.usuario) {
                    validator.usuario = "Ingrese un usuario";
                }
            }
            if (!peticion.zona_predio) {
                validator.zona_predio = "Seleccione una zona del predio";
            }
            if (!peticion.direccion && !peticion.predio && !peticion.informacion_adicional) {
                validator.predio = "Ingrese la información del predio";
            }
            if (!peticion.codigo_unico) {
                validator.codigo_unico = "Ingrese el código único.";
            } 
            else if(peticion.codigo_unico.length!==30) {
                validator.codigo_unico = "El código único debe tener 30 numeros y tiene "+peticion.codigo_unico.length;
            }
            if (!peticion.idbarrio) {
                validator.idbarrio = "Ingrese el barrio.";
            }
            else if (!peticion.idbarrio.idbarrio) {
                validator.idbarrio = "Ingrese el barrio.";
            } 
            $scope.validator = validator;
            console.log(validator);
            return $.isEmptyObject(validator);
        };

        $scope.save = function () 
        {
            $scope.iniciarEspera();
            $scope.saveButton = false;  
            if($scope.peticion.zona_predio===1) {
                $scope.peticion.direccion = document.getElementById('BusquedaDireccionVisual').value;
                $scope.peticion.informacionadicional = document.getElementById('BusquedaInformacionAdicional').value;
            }            
            var files = $scope.files;
            var validate = validateLineas2Save();
            if (validate && files && files.length) {                
                dsJqueryUtils.goTop();
                Upload.upload({
                    url: root+'solicitud/nomenclatura/',
                    data: {
                        data: $scope.peticion,
                        usuario: $scope.usuario,
                        files: files
                    }
                }).then(function (response) {
                    $scope.result = response.data;
                    $scope.saveButton = true;
                    callback(response.data);
                    if (response.data.success) {
                        $scope.peticion = {};               
                        $scope.files = [];
                        $scope.peticion.zona_predio = 1;
                    }
                    $scope.saveButton = true;
                    $scope.finalizarEspera();
                }, function (response) {
                    if (response.status > 0) {
                        $scope.errorMsg = response.status + ': ' + response.data;
                    }
                }, function (evt) {
                    $scope.progress =
                            Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
                $scope.ocultarModal = false;
            } else if (validate) {
                Upload.upload({
                    url: root+'solicitud/lineas/',
                    data: {
                        data: $scope.peticion,
                        usuario: $scope.usuario
                    }
                }).then(function (response) {
                    $scope.saveButton = true;
                    $scope.result = response.data;
                    callback(response.data);
                    if (response.data.success) {
                        $scope.peticion = {};
                        $scope.usuario = {};
                        $scope.files = [];
                        $scope.peticion.zona_predio = 1;
                    }
                    $scope.saveButton = true;
                    $scope.finalizarEspera();
                });
            } else {
                dsJqueryUtils.goTop();
                $scope.saveButton = true;
                $scope.finalizarEspera();
            }
        };

        $scope.cancel = function () {
        };
    }
]);
