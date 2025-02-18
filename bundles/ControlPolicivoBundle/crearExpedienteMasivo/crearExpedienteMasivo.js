saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlpolicivo-crearexpedientemasivo", {
            url: "/controlpolicivo/crearexpedientemasivo",
            views: {
                "main": {
                    controller: "ControlPolicivoCrearExpedienteMasivoCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/crearExpedienteMasivo/crearExpedienteMasivo.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoCrearExpedienteMasivoCtrl", ["$scope", "$http", "root", "$stateParams", "Comparendo", "ComparendosPrimeraInstancia", "LoadingOverlap", 
    function ($scope, $http, root, $stateParams, Comparendo, ComparendosPrimeraInstancia, LoadingOverlap) {
        
        $scope.root = root;
        $scope.data = null;
        $scope.tienePendientesPorGenerar = false;
        
        $scope.consultarComparendos = function () {
            LoadingOverlap.show();
            $http.post(root+'controlpolicivo/comparendosxexpedienteauto',{"fecha":$scope.query.fechaComparendo}).then(function (response) {                
                $scope.data = response['data'];
                $scope.totalItems = $scope.data.length;
                LoadingOverlap.hide();
                $scope.tienePendientesPorGenerar = false;
                $scope.data.forEach(function(item) {
                    if(item.estado == 'No generado'){
                        $scope.tienePendientesPorGenerar = true;
                    }
                });
            });
        };

        $scope.limpiar = function() {
            $scope.data = null;
            $scope.query = {};
        }

        $scope.generarExpedientesMasivos = function() {
            if($scope.query.consecutivoExpediente > 0 && $scope.query.consecutivoAuto>=0) {                
                if($scope.tienePendientesPorGenerar) {
                    LoadingOverlap.show();
                    const request =  {"query": $scope.query, "data": $scope.data};
                    const consecutivoExpedienteHasta = $scope.query.consecutivoExpediente+ $scope.data.length -1;           
                    $http.post(root+'controlpolicivo/primerainstancia/expedientesmasivos',request).then(function(res){                
                        bootbox.alert(res.data.msg);
                        $scope.consultarComparendos();
                    });
                } else {
                    bootbox.alert("No tiene expedientes por generar.");
                }
            }
            
            
        }
    }
]);