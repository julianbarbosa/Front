saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("ver-detalle-lineas", {
            url: "/lineas/verdetalle/:idsolicitud",
            views: {
                "main": {
                    controller: "VerDetalleCtrl",
                    templateUrl: "../bundles/LineasBundle/verDetalle/verDetalle.tpl.html"
                }
            }
        });
    }
]).controller("VerDetalleCtrl", ["$scope", "$stateParams", "Demarcacion","LineaDemarcacion", 
    function ($scope, $stateParams, Demarcacion, LineaDemarcacion) {
        $scope.item = {};
        $scope.item.demarcaciones = [];
        $scope.item.idSolicitud = $stateParams.idsolicitud;
        
        LineaDemarcacion.locate({id: $scope.item.idSolicitud }).$promise.then(function(response) {           
            $scope.item = response;
            Demarcacion.query({id: response.id}).$promise.then(function(response) {
               $scope.item.demarcaciones = response;
            });
        });               

        $scope.localizaciones = [{'id':1,'nombre':'Nor-Este'},
                                {'id':2,'nombre':'Nor-Oeste'},
                                {'id':3,'nombre':'Sur-Este'},
                                {'id':4,'nombre':'Sur-Oeste'}];          
    }
]);
