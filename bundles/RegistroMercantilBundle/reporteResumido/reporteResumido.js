saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("registromercantil-reporteresumido", {
            url: "/registro-mercantil/reporte/resumido",
            views: {
                "main": {
                    controller: "RegistroMercantilReporteResumidoCtrl",
                    templateUrl: "../bundles/RegistroMercantilBundle/reporteResumido/reporteResumido.tpl.html"
                }
            }
        });
    }
]).controller("RegistroMercantilReporteResumidoCtrl", ["$scope","$http","root", 
    function ($scope, $http, root) {
        $scope.consultar = function() {            
            var options = { year: 'numeric', month: 'long', day: 'numeric' };
			window.open(root+'registromercantil/reporte/resumido/'+dateFormat($scope.data.fechaInicial)+'/'+dateFormat($scope.data.fechaFinal));
        }
        function dateFormat(date) {
            return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        }
        
    }
]);
