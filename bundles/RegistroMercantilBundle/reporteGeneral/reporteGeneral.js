saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("registromercantil-reportegeneral", {
            url: "/registro-mercantil/reporte/general",
            views: {
                "main": {
                    controller: "RegistroMercantilReporteGeneralCtrl",
                    templateUrl: "../bundles/RegistroMercantilBundle/reporteGeneral/reporteGeneral.tpl.html"
                }
            }
        });
    }
]).controller("RegistroMercantilReporteGeneralCtrl", ["$scope","$http","root", 
    function ($scope, $http, root) {
        $scope.consultar = function() {            
            var options = { year: 'numeric', month: 'long', day: 'numeric' };
			window.open(root+'registromercantil/reporte/general/'+dateFormat($scope.data.fechaInicial)+'/'+dateFormat($scope.data.fechaFinal)+'/null/null');
        }
        function dateFormat(date) {
            return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        }
        
    }
]);
