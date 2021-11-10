saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("crear-peticion", {
            url: "/peticion/crear",
            views: {
                "main": {
                    controller: "CrearPeticionCtrl",
                    templateProvider: function($templateCache){
                        return $templateCache.get("ConstruccionBundle/crearPeticion/crearPeticion.tpl.html");
                    }
                }
            }
        });
    }
]).controller("CrearPeticionCtrl", ["$scope", "Nomenclatura", "Predio", "Usuario", "dsJqueryUtils", "$uibModal", "Upload",
    function ($scope, Nomenclatura, Predio, Usuario, dsJqueryUtils, $uibModal, Upload) {
        $scope.peticion = {};
        $scope.peticion.tiene_radicado = false;
        $scope.ocultarModal = true;
        $scope.files = {};
        $scope.peticion.tipo_busqueda = 1;
        $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
        $scope.modalOpen = false;
        $scope.peticion.realizada_ciudadano = true;

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

        
        
        function obtenerModalIngresoDireccion() {
            $.ajax({
                url: "https://planeacion.cali.gov.co/saul_dev/dapm.php/nomenclatura",
                data: { 
                    fieldNamecallbackFunction: "cerrarModal", 
                    fieldNameNPNrequerido: false, 
                    fieldNameDiv: "modalIngresoDireccion", 
                    fieldNameNumeroUnico: "NPN", 
                    fieldNameDireccion: "BusquedaDireccion", 
                    fieldNameDireccionAdicional: "BusquedaInformacionAdicional"
                },
                success: function (data) {
                    $('#modalIngresoDireccion').empty();
                    $('#modalIngresoDireccion').append(data);
                    $('#modalIngresoDireccion').modal('show');
                }
            });
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

        function validateSave() {
            console.info("entro al validateSave");
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
            if (!peticion.comentario) {
                validator.comentario = "Ingrese un comentario";
            }   
            if (!peticion.direccion && !peticion.predio && !peticion.informacion_adicional) {
                validator.predio = "Ingrese la información del predio";
            }
            if (peticion.tiene_radicado && !peticion.radicado) {
                validator.radicado = "Ingrese un radicado";
            }
            console.info(validator);
            $scope.validator = validator;
            return $.isEmptyObject(validator);
        };

        $scope.save = function () 
        {
            var direccion = document.getElementById('BusquedaDireccion').value;
            $scope.peticion.direccion = direccion;
            var files = $scope.files;
            var validate = validateSave();
            console.log("validate="+validate);
            if (validate && files && files.length) {
                console.info("validate save entró");
                dsJqueryUtils.goTop();
                Upload.upload({
                    url: 'solicitud/',
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
                        $scope.peticion.tiene_radicado = false;                        
                        $scope.files = [];
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
            } else if (validate) {
                Upload.upload({
                    url: 'solicitud/',
                    data: {
                        data: $scope.peticion,
                        usuario: $scope.usuario
                    }
                }).then(function (response) {
                    $scope.result = response.data;
                    callback(response.data);
                    if (response.data.success) {
                        $scope.peticion = {};
                        $scope.usuario = {};
                        $scope.files = [];
                    }
                });
            } else {
                dsJqueryUtils.goTop();
            }
        };

        $scope.cancel = function () {
        };
    }
]);
