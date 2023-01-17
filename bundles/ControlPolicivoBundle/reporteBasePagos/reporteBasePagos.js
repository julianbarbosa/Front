saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlsanciones-reportebasepagos", {
            url: "/controlsanciones/reporte/pagos",
            views: {
                "main": {
                    controller: "ControlPolicivoReporteBasePagosCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/reporteBasePagos/reporteBasePagos.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoReporteBasePagosCtrl", ["$scope","$http","root", 
    function ($scope, $http, root) {
        $scope.consultar = function() {            
            var options = { year: 'numeric', month: 'long', day: 'numeric' };
			window.open(root+'controlpolicivo/descargarpagos/'+dateFormat($scope.data.fechaInicial)+'/'+dateFormat($scope.data.fechaFinal));
        }
        function dateFormat(date) {
            return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        }
        
    }
]);
