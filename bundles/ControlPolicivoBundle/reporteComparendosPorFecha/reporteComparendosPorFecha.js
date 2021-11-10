saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlsanciones-reportecomparendosporfecha", {
            url: "/controlsanciones/reporte/comparendosporfecha",
            views: {
                "main": {
                    controller: "ControlPolicivoReporteComparendosPorFechaCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/reporteComparendosPorFecha/reporteComparendosPorFecha.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoReporteComparendosPorFechaCtrl", ["$scope","$http","root", 
    function ($scope, $http, root) {
        $scope.consultar = function() {            
            var options = { year: 'numeric', month: 'long', day: 'numeric' };
			window.open(root+'controlpolicivo/reporte/comportamientocontario/'+dateFormat($scope.data.fechaInicial)+'/'+dateFormat($scope.data.fechaFinal)+'/null/null');
        }
        function dateFormat(date) {
            return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        }
        
    }
]);
