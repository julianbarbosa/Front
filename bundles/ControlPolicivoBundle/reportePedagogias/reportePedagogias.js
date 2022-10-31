saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlsanciones-reportepedagogia", {
            url: "/controlsanciones/reporte/pedagogia",
            views: {
                "main": {
                    controller: "ControlPolicivoReportePedagogiasCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/reportePedagogias/reportePedagogias.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoReportePedagogiasCtrl", ["$scope","$http","root", 
    function ($scope, $http, root) {
        $scope.consultar = function() {            
            var options = { year: 'numeric', month: 'long', day: 'numeric' };
			window.open(root+'controlpolicivo/reporte/pedagogia/'+dateFormat($scope.data.fechaInicial)+'/'+dateFormat($scope.data.fechaFinal)+'/null/null');
        }
        function dateFormat(date) {
            return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        }
        
    }
]);
