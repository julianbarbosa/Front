saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlsanciones-indicadoresporfuncionario", {
            url: "/controlsanciones/indicadores/porfuncionario",
            views: {
                "main": {
                    controller: "ControlPolicivoIndicadoresPorFuncionarioCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/indicadoresControlSancionesPorFuncionario/indicadoresControlSancionesPorFuncionario.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoIndicadoresPorFuncionarioCtrl", ["$scope","$http","root", 
    function ($scope, $http, root) {
        $scope.consultar = function() {            
            var options = { year: 'numeric', month: 'long', day: 'numeric' };
            $http.get(root+'controlsanciones/indicadores/cantidadrevisiones/'+dateFormat($scope.data.fechaInicial)+'/'+dateFormat($scope.data.fechaFinal)).then(function (result) {                
                $scope.result = result.data;
            });
            $http.get(root+'controlsanciones/indicadores/cantidadmovimientosporestado/'+dateFormat($scope.data.fechaInicial)+'/'+dateFormat($scope.data.fechaFinal)).then(function (result) {                
                $scope.resultPorEstado = result.data;
            });
			$http.get(root+'controlsanciones/indicadores/cantidadingresosporinspeccion/'+dateFormat($scope.data.fechaInicial)+'/'+dateFormat($scope.data.fechaFinal)).then(function (result) {                
                $scope.resultPorInspeccion = result.data;
            });
        }
        function dateFormat(date) {
            return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        }
        
    }
]);
