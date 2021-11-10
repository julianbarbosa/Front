saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlsanciones-reporteprogramacionpedagogia", {
            url: "/controlsanciones/reporte/programacionpedagogia",
            views: {
                "main": {
                    controller: "ControlPolicivoReporteProgramacionPedagogiasCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/reporteProgramacionPedagogias/reporteProgramacionPedagogias.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoReporteProgramacionPedagogiasCtrl", ["$scope","$http","root", 
    function ($scope, $http, root) {
        $scope.consultar = function() {            
            var options = { year: 'numeric', month: 'long', day: 'numeric' };
			window.open(root+'controlpolicivo/reporte/programacionpedagogia/'+dateFormat($scope.data.fechaInicial)+'/'+dateFormat($scope.data.fechaFinal)+'/null/null');
        }
        function dateFormat(date) {
            return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        }
        
    }
]);
