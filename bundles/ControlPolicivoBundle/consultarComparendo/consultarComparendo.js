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
]).controller("ControlPolicivoConsultarComprendoCtrl", ["$scope", "$http", "root", "$stateParams", "Comparendo", "MovimientoComparendo", "LoadingOverlap", 
    function ($scope, $http, root, $stateParams, Comparendo, MovimientoComparendo, LoadingOverlap) {
        $scope.item = {};
        $scope.item.idcomparendo = $stateParams.idcomparendo;
        $scope.root = root;
        $scope.ocultarModal = true;
        $scope.isReadOnly = false;        
        $scope.isSuccess = false;
        $scope.querys = 2;
        $scope.incremento_reincidencia = "0";
        
        LoadingOverlap.show($scope);
                
        Comparendo.query({id:$scope.item.idcomparendo}).$promise.then(function(result) {
            $scope.comparendo = result.data;
            $scope.querys--;
        });        
        
        MovimientoComparendo.query({id:$scope.item.idcomparendo}).$promise.then(function(result) {
            $scope.listarPlantillas($scope.item.idcomparendo);
            $scope.arrayMovimientoComparendo = result;
            $scope.querys--;
        });        
        
        $scope.$watch('querys', function() {            
            if($scope.querys===0) {
                LoadingOverlap.hide($scope);
            }
        });
            
        $scope.listarPlantillas = function (comparendoId) {
            $http.get(root + "Plantilla/listar/por_comparendo/"+comparendoId)
                .then(function (response) {
                    //$scope.listar = response.data;
                    $scope.listar = {
                        lista: response.data.data
                    };
                });
            $scope.cargando = false;    
        };

        
    }
]);
