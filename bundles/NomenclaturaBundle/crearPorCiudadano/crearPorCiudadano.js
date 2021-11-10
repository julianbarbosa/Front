saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("crear-peticion-nomenclatura-ciudadano", {
            url: "/solicitud_nomenclatura/",
            views: {
                "main": {
                    controller: "CrearPeticionNomenclaturaCiudadanoCtrl",
                    templateUrl: "../bundles/NomenclaturaBundle/crearPorCiudadano/crearPorCiudadano.tpl.html"
                }
            }
        });
    }
]).controller("CrearPeticionNomenclaturaCiudadanoCtrl", ["$scope", "root", "urlPlugInNomenclatura", "Nomenclatura", "Comuna", "Barrio", "Predio", "Usuario", "dsJqueryUtils", "$uibModal", "Upload",
    function ($scope, root, urlPlugInNomenclatura,  Nomenclatura,  Comuna, Barrio, Predio, Usuario, dsJqueryUtils, $uibModal, Upload) {        
        $scope.peticion = {};        
        $scope.ocultarModal = true;        
        $scope.modalOpen = false;                
        $scope.comunas = Comuna.query();
        $scope.peticion.zona_predio = 1;
        $scope.maxlengthcodigounico = 30;
        $scope.maxlengthnumeropredial = 13;
        
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
        
        $scope.newModalUsuario = function () {
            var modalInstance = $uibModal.open({
                controller: 'ModalUsuarioCtrl',
                templateUrl: '../bundles/ConstruccionBundle/crearPeticion/modalUsuario.tpl.html',
                scope: $scope,
                resolve: {
                    identificacion: function () {
                        return $scope.peticion.usuario;
                    }
                }
            });
            
            modalInstance.opened.then(function () {
                $scope.modalOpen = true;
            });

            modalInstance.result.then(function (usuario) {
                $scope.modalOpen = false;
                $scope.peticion.usuario = usuario.identificacion + " - " + usuario.nombre + " " + usuario.apellido;
                $scope.peticion.new_usuario = usuario;
            }, function () {
                $scope.modalOpen = false;
            });            
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
            return Usuario.query({"key": viewValue}).
            $promise.then(function (response) {
                if (response.length == 0 && $scope.modalOpen===false) {
                    $scope.modalOpen=true;
                    $scope.newModalUsuario($scope);
                }
                return response.map(function (item) {
                    return item;
                });
            });
        };

        $scope.faltante_codigo_unico = $scope.maxlengthcodigounico;
        $scope.$watch('peticion.codigo_unico', function() {
            if(!(angular.isUndefined($scope.peticion.codigo_unico))) {
                $scope.faltante_codigo_unico = $scope.maxlengthcodigounico - $scope.peticion.codigo_unico.length;            
            }            
        });
        
        $scope.faltante_numero_predial = $scope.maxlengthnumeropredial;
        $scope.$watch('peticion.numero_predial', function() {
            if(!(angular.isUndefined($scope.peticion.numero_predial))) {
                $scope.faltante_numero_predial = $scope.maxlengthnumeropredial - $scope.peticion.numero_predial.length;            
            }
        });
        
        $scope.obtenerModalIngresoDireccion = function() {
            $.ajax({
                url: urlPlugInNomenclatura,
                data: { 
                    fieldNamecallbackFunction: "cerrarModal", 
                    fieldNameNPNrequerido: true, 
                    fieldNameDiv: "modalIngresoDireccion", 
                    fieldNameNumeroUnico: "NPN", 
                    fieldNameDireccion: "BusquedaDireccion", 
                    fieldNameDireccionAdicional: "BusquedaInformacionAdicional"
                },
                success: function (data) {
                    console.log("data=>"+data);
                    $('#modalIngresoDireccion').empty();
                    $('#modalIngresoDireccion').append(data);
                    $('#modalIngresoDireccion').modal('show');
                }
            });
        }

        
        
        function callback(data) {
            console.log("data",data);
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

        function validateNomenclatura2Save() {
            if(angular.isUndefined($scope.peticion.codigo_unico) ) {
                $scope.peticion.codigo_unico = document.getElementById('NPN').value;
            }            
            var validator = {},
                    peticion = $scope.peticion;            
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
            $scope.validator = validator;
            console.log(validator);
            return $.isEmptyObject(validator);
        };

        $scope.save = function () 
        {
            var direccion = document.getElementById('BusquedaDireccion').value;
            $scope.peticion.direccion = direccion;
            var files = $scope.files;
            var validate = validateNomenclatura2Save();
            if (validate && files && files.length) {                
                dsJqueryUtils.goTop();
                Upload.upload({
                    url: root+'crear_solicitud_nomenclatura_ciudadano/',
                    data: {
                        data: $scope.peticion,
                        usuario: $scope.usuario,
                        files: files
                    }
                }).then(function (response) {
                    $scope.result = response.data;
                    callback(response.data);
                    if (response.data.success) {
                        $scope.peticion = {};               
                        $scope.files = [];
                        $scope.peticion.zona_predio = 1;
                    }
                }, function (response) {
                    if (response.status > 0) {
                        $scope.errorMsg = response.status + ': ' + response.data;
                    }
                }, function (evt) {
                    $scope.progress =
                            Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
                $scope.ocultarModal = false;
            } else {
                dsJqueryUtils.goTop();
            }
        };

        $scope.cancel = function () {
        };
    }
]);
