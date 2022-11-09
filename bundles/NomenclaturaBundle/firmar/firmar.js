saul.config(["$stateProvider", function(a) {
    a.state("certificado-nomenclatura-firmar", {
        url: "/certificado_nomenclatura/firmar/:idsolicitud",
        views: {
            main: {
                controller: "FirmarCertificadoNomenclaturaCtrl",
                templateUrl: "../bundles/NomenclaturaBundle/firmar/firmar.tpl.html"
            }
        }
    })
}]).controller("FirmarCertificadoNomenclaturaCtrl", ["$scope", "root", "$stateParams", "Solicitud", "SolicitudXNomenclatura", "DevolverCertificadoNomenclatura", "FirmaCertificadoNomenclatura", "dsJqueryUtils", 
        function($scope, root, $stateParams, Solicitud, SolicitudXNomenclatura, DevolverCertificadoNomenclatura, FirmaCertificadoNomenclatura, dsJqueryUtils) {    
            $scope.idSolicitud = $stateParams.idsolicitud;
            $scope.comentarios = "";
            $scope.root = root;
            $scope.cantidad_nomenclaturas = 0;
            Solicitud.find({ id: $scope.idSolicitud }).$promise.then(function(result) {
                $scope.data = result.data;
                SolicitudXNomenclatura.find({idsolicitud: $scope.idSolicitud}).$promise.then(function(result) {
                    $scope.data.direcciones = result;
                    angular.isUndefinedOrNull($scope.data.direcciones[0]) || ($scope.data.nomenclatura = $scope.data.direcciones[0].nomenclatura, $scope.cantidad_nomenclaturas = $scope.data.direcciones.length);
                    angular.isUndefinedOrNull($scope.data.nomenclatura.direccionVisual) || ($scope.data.nomenclatura.direccion = $scope.data.nomenclatura.direccionVisual);
                });
            });
            angular.isUndefinedOrNull = function(val) {
                return angular.isUndefined(val) || null === val;
            };

            $scope.hideAlert = function() {
                $scope.validator = {};
            };

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

            $scope.firmar = function() {
                bootbox.confirm("Esta acción firma digitalmente el certificado y lo sube al ORFEO, desea continuar?", function(result) {
                    $(this).attr("disabled", !0);
                    $(this).val("Enviando...");
                    if(result) {
                        dsJqueryUtils.goTop();
                        FirmaCertificadoNomenclatura.save({id: $scope.idSolicitud}).$promise.then(function(data) {
                            callback(data);
                        });
                        $scope.ocultarModal = !1;
                    }
                });
            };

            $scope.devolver = function() {
                bootbox.confirm("Confirma que desea realizar esta acción?", function(result) {
                    $(this).attr("disabled", !0);
                    $(this).val("Enviando...");
                    if(result){
                        dsJqueryUtils.goTop();
                        DevolverCertificadoNomenclatura.save({idsolicitud: a.idSolicitud,comentarios: a.comentarios}).$promise.then(function(data) {
                            callback(data);
                        });
                        $scope.ocultarModal = !1;
                    }
                });
            };
        }]);