saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("visita", {
            url: "/mostrar_visita/:idvisita",
            views: {
                "main": {
                    controller: "VisitaCtrl",
                    templateUrl: "../bundles/ConstruccionBundle/visita/visita.tpl.html"
                }
            }
        });
    }
]).controller("VisitaCtrl", ["$scope", "Solicitud", "HistorialVisita",
    function ($scope, Solicitud, HistorialVisita) {        
        $scope.proceso = {};
        $scope.ocultarModal = true;        
        Solicitud.find({id: $scope.idsolicitud}).$promise.then(function(response){ 
            $scope.solicitud = response['data'];
            $scope.cantidadSolicitudes = response['cantidadSolicitudes'];
        });               
        HistorialVisita.query({id: $scope.idsolicitud}).$promise.then(function(response){            
            $scope.visitas = response;
        });
    }
]);
