saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlsanciones-reporteexpedienteensap", {
            url: "/controlsanciones/reporte/expedientesensap",
            views: {
                "main": {
                    controller: "ControlPolicivoReporteExpedienteSAPCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/reporteExpedienteSAP/reporteExpediente.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoReporteExpedienteSAPCtrl", ["$scope","$http","root", 
    function ($scope, $http, root) {
        $scope.consultar = function() {            
            var options = { year: 'numeric', month: 'long', day: 'numeric' };
			window.open(root+'controlpolicivo/reporte/expedientescargadosensap/');
        }       
    }
]);
