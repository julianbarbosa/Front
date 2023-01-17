saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("solicitud", {
            url: "/solicitud/:idsolicitud",
            views: {
                "main": {
                    controller: "SolicitudCtrl",
                    templateUrl: "../bundles/ConstruccionBundle/solicitud/solicitud.tpl.html"
                }
            }
        });
    }
]).controller("SolicitudCtrl", ["$scope", "$stateParams", "Solicitud", 
    function ($scope, $stateParams, Solicitud) {   
        $scope.asignacion = {};
        $scope.asignacion.idsolicitud = $stateParams.idsolicitud;        
        $scope.ocultarModal = true;
        Solicitud.find({id: $scope.idsolicitud}).$promise.then(function(response){            
            $scope.solicitud = response['data'];
        });   
    }
]);
