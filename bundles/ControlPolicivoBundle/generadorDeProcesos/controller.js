saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlsanciones-generadorprocesos", {
            url: "/controlsanciones/generador-procesos",
            views: {
                "main": {
                    controller: "ControlSancionesGeneradorProcesosCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/generadorDeProcesos/template.tpl.html"
                }
            }            
        });
    }
]).controller("ControlSancionesGeneradorProcesosCtrl", ["$scope", "$http", "root", "LoadingOverlap",
function ($scope, $http, root, LoadingOverlap) {
    
    $scope.obtenerReportes = function() {
        LoadingOverlap.show($scope);
        $http.get(root+"dominio/procesos-rnmc").then(function(response) {
            $scope.arrayReportes = response.data;
        }).finally(function(){
            LoadingOverlap.hide($scope);
        });
    }
    $scope.obtenerReportes();
    
}]);