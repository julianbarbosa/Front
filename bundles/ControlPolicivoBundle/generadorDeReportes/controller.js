saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlsanciones-generadorreportes", {
            url: "/controlsanciones/generador-reportes",
            views: {
                "main": {
                    controller: "ControlSancionesGeneradorReportesCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/generadorDeReportes/template.tpl.html"
                }
            }            
        });
    }
]).controller("ControlSancionesGeneradorReportesCtrl", ["$scope", "$http", "root", "LoadingOverlap",
function ($scope, $http, root, LoadingOverlap) {
    
    $scope.obtenerReportes = function() {
        LoadingOverlap.show($scope);
        $http.get(root+"dominio/reporte-rnmc").then(function(response) {
            $scope.arrayReportes = response.data;
        }).finally(function(){
            LoadingOverlap.hide($scope);
        });
    }
    $scope.obtenerReportes();
    
}]);