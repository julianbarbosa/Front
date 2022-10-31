saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlsanciones-reporteplantillafuid", {
            url: "/controlsanciones/reporte/plantillafuid",
            views: {
                "main": {
                    controller: "ControlPolicivoreportePlantillaFuidCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/reportePlantillaFUID/reportePlantillaFUID.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoreportePlantillaFuidCtrl", ["$scope","$http","root", 
    function ($scope, $http, root) {
        $scope.consultar = function() {            
            var options = { year: 'numeric', month: 'long', day: 'numeric' };
			window.open(root+'controlsanciones/generarfuid/88/'+$scope.data.inspeccion+'/'+dateFormat($scope.data.fechaInicial)+'/'+dateFormat($scope.data.fechaFinal));
        }
		$scope.consultarInspecciones = function () {
            $http.get(root+'controlpolicivo/inspector/getall',{}).then(function (result) {                                            
                $scope.inspecciones = result.data.data;
            });
        };
        $scope.consultarInspecciones();
		
        function dateFormat(date) {
            return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        }
        
    }
]);
