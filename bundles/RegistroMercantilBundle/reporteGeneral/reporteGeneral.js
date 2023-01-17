saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("registromercantil-reportegeneral", {
            url: "/registro-mercantil/reporte/general/:id",
            views: {
                "main": {
                    controller: "RegistroMercantilReporteGeneralCtrl",
                    templateUrl: "../bundles/RegistroMercantilBundle/reporteGeneral/reporteGeneral.tpl.html"
                }
            }
        });
        $stateProvider.state("rit-reportegeneral", {
            url: "/rit/reporte/general/:id",
            views: {
                "main": {
                    controller: "RegistroMercantilReporteGeneralCtrl",
                    templateUrl: "../bundles/RegistroMercantilBundle/reporteGeneral/reporteGeneral.tpl.html"
                }
            }
        });
    }
]).controller("RegistroMercantilReporteGeneralCtrl", ["$scope","$http","root", "$stateParams",
    function ($scope, $http, root, $stateParams) {
        $scope.consultar = function() {            
            var options = { year: 'numeric', month: 'long', day: 'numeric' };
			window.open(root+'registromercantil/reporte/general/'+dateFormat($scope.data.fechaInicial)+'/'+dateFormat($scope.data.fechaFinal)+'/null/null');
        }
        if($stateParams.id=='rm') {
            $scope.titulo = "Registro Mercantil";
        }
        if($stateParams.id=='rit') {
            $scope.titulo = "Registro de Información Tributaria - RIT";
        }
        function dateFormat(date) {
            return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        }
        
    }
]);
