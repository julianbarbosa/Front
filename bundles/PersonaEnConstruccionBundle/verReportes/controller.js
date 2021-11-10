saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("personaenconstruccion-reportes", {
            url: "/persona-en-construccion/reportes/",
            views: {
                "main": {
                    controller: "PersonaEnConstruccionGeneradorReportesCtrl",
                    templateUrl: "../bundles/PersonaEnConstruccionBundle/verReportes/template.tpl.html"
                }
            }            
        });
    }
]).controller("PersonaEnConstruccionGeneradorReportesCtrl", ["$scope", "$http", "root", "LoadingOverlap",
function ($scope, $http, root, LoadingOverlap) {
    
    $scope.obtenerReportes = function() {
        LoadingOverlap.show($scope);
        $http.get(root+"dominio/reporte-persona-en-construccion").then(function(response) {
            $scope.arrayReportes = response.data;
        }).finally(function(){
            LoadingOverlap.hide($scope);
        });
    }
    $scope.obtenerReportes();
    
}]);