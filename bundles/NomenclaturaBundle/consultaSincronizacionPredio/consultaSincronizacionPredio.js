saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("predio-consultasincronizacionpredio", {
            url: "/predio/consultasincronizacion",
            views: {
                "main": {
                    controller: "ConsultaSincronizacionPredioCtrl",
                    templateUrl: "../bundles/NomenclaturaBundle/consultaSincronizacionPredio/consultaSincronizacionPredio.tpl.html"
                }
            }
        });
    }
]).controller("ConsultaSincronizacionPredioCtrl", ["$scope", "$state", "root", "$http",
    function ($scope, $state, root, $http) {
        $scope.currentPage = 1;
        $scope.numPerPage = 10;
        $scope.dataPredio = [];

        $scope.numberOfPages=function(){
            $scope.numPages = Math.ceil($scope.dataPredio.length/$scope.numPerPage)
            return $scope.numPages;                
        }
        $scope.numberOfPages();
        $http.get('http://saul.cali.gov.co/saul2/app_dev.php/predio/sincronizacionpwc/2019-11').then(function(response) {
            $scope.dataPredio =  response.data;
            $scope.totalItems = $scope.dataPredio.length;
            console.log($scope.dataPredio);
        })
        
    }
]).filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});