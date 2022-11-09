saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlsanciones-reporteexpediente", {
            url: "/controlsanciones/reporte/expediente",
            views: {
                "main": {
                    controller: "ControlPolicivoReporteExpedienteCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/reportePedagogias/reportePedagogias.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoReporteExpedienteCtrl", ["$scope","$http","root", 
    function ($scope, $http, root) {
        $scope.consultar = function() {            
            var options = { year: 'numeric', month: 'long', day: 'numeric' };
			window.open(root+'controlpolicivo/reporte/expedientesporestado/'+dateFormat($scope.data.fechaInicial)+'/'+dateFormat($scope.data.fechaFinal));
        }
        function dateFormat(date) {
            return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        }
        
    }
]);
