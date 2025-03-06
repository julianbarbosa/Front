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
        $scope.query = {};
        $scope.incremento_reincidencia = "0";
        
        LoadingOverlap.show($scope);
                
        Comparendo.query({id:$scope.item.idcomparendo}).$promise.then(function(result) {
            $scope.comparendo = result.data;
            $scope.expediente = result.expediente;
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
            

        $scope.generarExpedientesMasivos = function() {
            if($scope.query.consecutivoExpediente > 0 && $scope.query.consecutivoAuto>=0) {                                
                const comparendo = {"id": $scope.item.idcomparendo, "reincidencia": $scope.item.reincidencia };
                const request =  {"query": $scope.query, "data": [comparendo]};                
                LoadingOverlap.show();
                $http.post(root+'controlpolicivo/primerainstancia/expedientesmasivos',request).then(function(res){                
                    LoadingOverlap.hide();
                    $scope.expediente = res.data.expediente;                   
                });                
            }  else {
                bootbox.alert("Ingrese los consecutivos para generar expedientes masivos.");
            }          
        }       
    }
]);
