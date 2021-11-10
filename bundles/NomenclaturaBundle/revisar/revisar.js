saul.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("certificado-nomenclatura-revisar", {
            url: "/certificado_nomenclatura/revisar/:idsolicitud",
            views: {
                main: {
                    controller: "RevisarCertificadoNomenclaturaCtrl",
                    templateUrl: "../bundles/NomenclaturaBundle/revisar/revisar.tpl.html"
                }
            }
        })
    }]).controller("RevisarCertificadoNomenclaturaCtrl", ["$scope", "root", "$stateParams", "Solicitud", "SolicitudXNomenclatura", "DevolverCertificadoNomenclatura", "AprobarFirmaCertificadoNomenclatura", "dsJqueryUtils", function ($scope, root, $stateParams, Solicitud, SolicitudXNomenclatura, DevolverCertificadoNomenclatura, AprobarFirmaCertificadoNomenclatura, dsJqueryUtils) {

        function callback(data) {
            $scope.validator = {};
            $scope.validator.alert = {};
            $scope.validator.alert.title = "Información: ";
            $scope.validator.alert.content = data.msg;
            $scope.validator.alert.type = data.type;
            $("html, body").animate({
                scrollTop: 0
            }, "slow", "swing");
        };
        
        $scope.idSolicitud = $stateParams.idsolicitud;
        $scope.comentarios = "";
        $scope.root = root;
        $scope.cantidad_nomenclaturas = 0;
        $scope.action_active = 0;
        
        Solicitud.find({id: $scope.idSolicitud}).$promise.then(function(result) {
            $scope.data = result.data, SolicitudXNomenclatura.find({
                idsolicitud: $scope.idSolicitud
            }).$promise.then(function(result) {
                $scope.data.direcciones = result;
                if(angular.isUndefinedOrNull($scope.data.direcciones[0])) {
                    angular.isUndefinedOrNull($scope.data.nomenclatura.direccionVisual) || ($scope.data.nomenclatura.direccion = $scope.data.nomenclatura.direccionVisual);
                } else { 
                    ($scope.data.nomenclatura = $scope.data.direcciones[0].nomenclatura, $scope.cantidad_nomenclaturas = $scope.data.direcciones.length);
                }
            });
        });         
        
        angular.isUndefinedOrNull = function (a) {
            return angular.isUndefined(a) || null === a;
        };

        $scope.onSelect = function ($item, $model, $label) {
            $scope.$item = $item;
            $scope.$model = $model;
            $scope.$label = $label;
        };

        $scope.hideAlert = function () {
            $scope.validator = {}
        }

        $scope.firmar = function () {
            bootbox.confirm("Esta acción aprobará la firma digital del certificado, desea continuar?",
                function (result) {
                    $(this).attr('disabled', true);
                    $(this).val('Enviando...');
                    if (result)
                    {
                        dsJqueryUtils.goTop();
                        AprobarFirmaCertificadoNomenclatura.save({"id": $scope.idSolicitud}).$promise.then(function (response) {
                            callback(response);
                        });
                        $scope.ocultarModal = false;
                    }
                });
        };

        $scope.devolver = function ()
        {
            bootbox.confirm("Confirma que desea realizar esta acción?",
                    function (result) {
                        $(this).attr('disabled', true);
                        $(this).val('Enviando...');
                        if (result) {
                            dsJqueryUtils.goTop();
                            DevolverCertificadoNomenclatura.save({"idsolicitud": $scope.idSolicitud, "comentarios": $scope.comentarios}).$promise.then(function (response) {
                                callback(response);
                            });
                            $scope.ocultarModal = false;
                        }
                    }
            );
        };
    }])