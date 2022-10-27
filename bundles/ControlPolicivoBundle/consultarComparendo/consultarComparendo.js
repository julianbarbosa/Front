saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlpolicivo-consultarcomprendo", {
            url: "/controlpolicivo/consultarcomparendo/:idcomparendo",
            views: {
                "main": {
                    controller: "ControlPolicivoConsultarComprendoCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/consultarComparendo/consultarComparendo.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoConsultarComprendoCtrl", ["$scope", "root", "$stateParams", "Comparendo", "MovimientoComparendo", "LoadingOverlap", 
    function ($scope, root, $stateParams, Comparendo, MovimientoComparendo, LoadingOverlap) {
        $scope.item = {};
        $scope.item.idcomparendo = $stateParams.idcomparendo;
        $scope.root = root;
        $scope.ocultarModal = true;
        $scope.isReadOnly = false;        
        $scope.isSuccess = false;
        $scope.querys = 2;
        
        LoadingOverlap.show($scope);
                
        Comparendo.query({id:$scope.item.idcomparendo}).$promise.then(function(result) {
            $scope.comparendo = result.data;
            $scope.querys--;
        });        
        
        MovimientoComparendo.query({id:$scope.item.idcomparendo}).$promise.then(function(result) {
            $scope.arrayMovimientoComparendo = result;
            $scope.querys--;
        });        
        
        $scope.$watch('querys', function() {            
            if($scope.querys===0) {
                LoadingOverlap.hide($scope);
            }
        });
              

    }
]);
