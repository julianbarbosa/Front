saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("solicitud-listar-historial", {
            url: "/solicitud/verhistorial/:idsolicitud",
            views: {
                "main": {
                    controller: "verHistorialSolicitudCtrl",
                    templateUrl: "../bundles/SolicitudBundle/verHistorial/verHistorial.tpl.html"
                }
            }
        });
    }
]).controller("verHistorialSolicitudCtrl", ["$scope", "root", "$http", "MovimientoSolicitud", "$stateParams",
    function ($scope, root, $http, MovimientoSolicitud, $stateParams) {        
        $scope.peticion = "";
        $scope.ocultarModal = true;
        
        $scope.idsolicitud = $stateParams.idsolicitud;
        $scope.solicitudes = MovimientoSolicitud.query({id:$stateParams.idsolicitud});
        
        $http.get(root+'solicitud/'+$stateParams.idsolicitud).then(function(response) {
            $scope.solicitud = response.data.data;            
            console.log("soliciud",$scope.solicitud);
        });
        
        $scope.hideAlert = function () {
            $scope.validator = {};
        };

        $scope.cancel = function () {
        };
    }
]);
