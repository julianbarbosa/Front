saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("controlsanciones-generadorreportesfiltro", {
            url: "/controlsanciones/generador-reportes/:id",
            views: {
                "main": {
                    controller: "ControlSancionesGeneradorReportesFiltroCtrl",
                    templateUrl: "../bundles/ControlPolicivoBundle/generadorDeReportesFiltro/template.tpl.html"
                }
            }            
        });
    }
]).controller("ControlSancionesGeneradorReportesFiltroCtrl", ["$scope", "$http", "$stateParams", "root", "LoadingOverlap", "UtilForm",
function ($scope, $http, $stateParams, root, LoadingOverlap, UtilForm) {
    
    $scope.data = [];
    
    $scope.obtenerReportes = function() {
        LoadingOverlap.show($scope);
        $http.get(root+"dominio/reporte-rnmc/"+$stateParams.id).then(function(response) {
            $scope.reporte = response.data;
            $scope.obtenerStores($scope.reporte.variables);
        }).finally(function(){
            LoadingOverlap.hide($scope);
        });
    }
    $scope.obtenerReportes();
    
    $scope.obtenerStores = function($variables) {
        angular.forEach($variables, function(variable) {
            if(variable.store!==undefined) {
                $scope.$eval(variable.store+'()');
            }
        })
    }
    
    $scope.getComportamientosContrarios = function() {
        $http.get(root+'comportamientocontrario/').then(function(result) {
            $scope.arrayComportamientoContrario = result.data;
        })
    }
    
    $scope.generarReporte = function(arrayData) {
        var jsonData = [{name: 'reporteId', value: $stateParams.id}];
        Object.keys(arrayData).forEach(function(key) {
            console.log(typeof arrayData[key]);
            if(typeof arrayData[key] === "object" && arrayData[key].id) {
                data = {name: key, value: arrayData[key].id};
            } else if(arrayData[key].getFullYear()) {
                data = {name: key, value: dateFormat(arrayData[key])};
            }
            else {
                data = {name: key, value: arrayData[key]};
            }     
            jsonData.push(data);
        }); 
        console.log(jsonData);
        UtilForm.openWith(
            root + "controlpolicivo/reporte/generador",
            'post',jsonData);
        //window.location.href = '#!/controlsanciones/generador-reportes';
    }
    
    function dateFormat(date) {
        return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
    }
}]);