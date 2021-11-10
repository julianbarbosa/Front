saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlsanciones-reporteplantillabase", {
            url: "/controlsanciones/reporte/plantillabase",
            views: {
                "main": {
                    controller: "ControlPolicivoreportePlantillaBaseCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/reportePlantillaBase/reportePlantillaBase.tpl.html"
                }
            }
        });
    }
]).controller("ControlPolicivoreportePlantillaBaseCtrl", ["$scope","$http","root", 
    function ($scope, $http, root) {
        $scope.consultar = function() {            
            var options = { year: 'numeric', month: 'long', day: 'numeric' };
			window.open(root+'controlsanciones/generarbase/88/'+dateFormat($scope.data.fechaInicial)+'/'+dateFormat($scope.data.fechaFinal));
        }
        function dateFormat(date) {
            return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        }
        
    }
]);
