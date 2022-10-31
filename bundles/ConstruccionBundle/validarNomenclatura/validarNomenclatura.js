saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("validar-nomenclatura", {
            url: "/nomenclatura/validar/:idsolicitud",
            views: {
                "main": {
                    controller: "ValidarNomenclaturaCtrl",
                    templateUrl: "../bundles/ConstruccionBundle/validarNomenclatura/validarNomenclatura.tpl.html"
                }
            }
        });
    }
]).controller("ValidarNomenclaturaCtrl", ["$scope", "$stateParams", "Solicitud", "TipoSolicitud", "Comuna", "Barrio", "dsJqueryUtils", "Upload", "$timeout", "$state",
    function ($scope, $stateParams, Solicitud, TipoSolicitud, Comuna, Barrio, dsJqueryUtils, Upload, $timeout, $state) {
        $scope.nomenclatura = {};
        $scope.nomenclatura.idsolicitud = $stateParams.idsolicitud;
        $scope.ocultarModal = true;
        $scope.solicitud = "";

        $scope.isSuccess = false;
        $scope.comunas = Comuna.query();
        
        Solicitud.query({id: $scope.nomenclatura.idsolicitud}).$promise.then(function (response) {
            $scope.nomenclatura = response['data'].nomenclatura;
            var predio = response['data'].nomenclatura.predio;
            console.log("predio", predio);
            if(predio) {
                $scope.nomenclatura.idcomuna = predio.barrio.comuna.idcomuna;            
                Barrio.query({idcomuna: response['data'].nomenclatura.predio.barrio.comuna.codigo}).$promise.then(function(response1) {                
                    $scope.barrios = response1;
                    $scope.nomenclatura.idbarrio = response['data'].nomenclatura.predio.barrio.idbarrio;
                });
            }
        });
        $scope.isReadOnly = false;
        $scope.tiposSolicitud = TipoSolicitud.query();

        $scope.tipoSolicitud = {};
        $scope.oculto = true;

        $scope.hideAlert = function () {
            $scope.validator = {};
        };

        $scope.cargarBarrios = function () {
            console.log($scope.nomenclatura);
            $scope.barrios = Barrio.query({idcomuna: $scope.nomenclatura.idcomuna});
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
            var validator = {};
            if (typeof $scope.nomenclatura.validacion === "undefined") {
                validator.validacion = "Debe seleccionar un campo de validación."
            }
            $scope.validator = validator;
            return $.isEmptyObject(validator);
        }
        ;

        $scope.save = function () {
            var validate = validateSave();
            if (validate) {
                Upload.upload({
                    url: 'nomenclatura/validar',
                    data: {
                        'idbarrio': $scope.nomenclatura.idbarrio,
                        'idsolicitud': $stateParams.idsolicitud, 
                        'validacion': $scope.nomenclatura.validacion, 
                        'codigounico': $scope.nomenclatura.predio.codigounico                        
                    }
                }).then(function (response) {
                    $scope.result = response.data;
                    callback(response.data);
                    if (response.data.success) {
                        $scope.nomenclatura = {};
                    }
                    $scope.isSuccess = true;
                    $timeout(function () {
                        $state.go('listar-peticion');
                    }, 3000);
                });
            } else {
                dsJqueryUtils.goTop();
            }
        };

        $scope.cancel = function () {
        };
    }
]);
