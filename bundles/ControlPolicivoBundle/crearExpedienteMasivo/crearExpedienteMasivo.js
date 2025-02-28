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
]).controller("ControlPolicivoCrearExpedienteMasivoCtrl", ["$scope", "$http", "root", "$stateParams", "$filter", "ComparendosPrimeraInstancia", "LoadingOverlap", 
    function ($scope, $http, root, $stateParams, $filter, ComparendosPrimeraInstancia, LoadingOverlap) {
        
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

        $scope.obtenerComparendosSeleccionados = function(data) {
            return $filter('filter')(data, {'seleccionado': true});
        }
          
        $scope.generarExpedientesMasivos = function() {
            if($scope.query.consecutivoExpediente > 0 && $scope.query.consecutivoAuto>=0) {                
                if($scope.tienePendientesPorGenerar) { 
                    const dataFilter = $scope.obtenerComparendosSeleccionados($scope.data);
                    const request =  {"query": $scope.query, "data": dataFilter };
                    if(dataFilter.length>0) {
                        LoadingOverlap.show();
                        $http.post(root+'controlpolicivo/primerainstancia/expedientesmasivos',request).then(function(res){                
                            bootbox.alert(res.data.msg);
                            $scope.consultarComparendos();
                        });
                    } else {
                        bootbox.alert("Debe seleccionar al menos un comparendo.");    
                    }
                } else {
                    
                    bootbox.alert("No tiene expedientes por generar.");
                }
            }
            
            
        }
    }
]);