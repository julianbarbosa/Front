saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("titulacionpredios-reportes", {
            url: "/titulacion-predios/reportes/",
            views: {
                "main": {
                    controller: "TitulacionPrediosListaReportesCtrl",
                    templateUrl: "../bundles/TitulacionPrediosBundle/verReportes/template.tpl.html"
                }
            }            
        });
    }
]).controller("TitulacionPrediosListaReportesCtrl", ["$scope", "$http", "root", "LoadingOverlap",
function ($scope, $http, root, LoadingOverlap) {
    
    $scope.obtenerReportes = function() {
        LoadingOverlap.show($scope);
        $http.get(root+"dominio/reporte-titulacion-gratuita").then(function(response) {
            $scope.arrayReportes = response.data;
        }).finally(function(){
            LoadingOverlap.hide($scope);
        });
    }
    $scope.obtenerReportes();
    
}]);