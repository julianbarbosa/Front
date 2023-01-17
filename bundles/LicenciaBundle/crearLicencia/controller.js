saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("licencia-crear", {
            url: "/licencia/crear",
            views: {
                "main": {
                    controller: "CrearLicenciaCtrl",
                    templateUrl: "../bundles/LicenciaBundle/crearLicencia/template.tpl.html"
                }
            }
        });
    }
]).controller("CrearLicenciaCtrl", ["$scope", "$http", "root",
    function ($scope, $http, root) {
        
      
        
        $scope.obtenerModalidad = function() {
            $http.get(root+"dominio/modalidad_licencia_construccion").then(function(response) {
                $scope.arrayModalidad = response.data;
            });
        }
        
        $scope.obtenerTipoLicencia = function() {
            $http.get(root+"dominio/tipo_licencia_construccion").then(function(response) {
                $scope.arrayTipoLicencia = response.data;
            });
        }
        
        $scope.consultarCuradurias = function() {
            $http.get(root+'licencias/curaduria/').then(function(data) {
                $scope.arrayCuradurias = data.data;
                $scope.arrayCuradurias.forEach(function(item) {
                    item['nombre'] = item.curaduria;
                })
            });          
        };
        
        $scope.obtenerBarrio = function() {
            $http.get(root+"barrio/").then(function(response) {
                $scope.arrayBarrio = response.data;
            });
        }
        
        $scope.validForm = function() {
            result1 = false;
            result2 = false;
            if($scope.item.tipolicencia) {
                Object.keys($scope.item.tipolicencia).forEach(function(key) {
                    if($scope.item.tipolicencia[key] == true) {
                        result1 = true;
                    }
                });
            }
            if($scope.item.modalidad) {    
                Object.keys($scope.item.modalidad).forEach(function(key) {
                    if($scope.item.modalidad[key] == true) {
                        result2 = true;
                    }
                });
            }
            return result1&&result2;
        }
        
        $scope.init = function() {
            $scope.item = {id: 0};
            $scope.result = null;
            $scope.obtenerModalidad();
            $scope.obtenerTipoLicencia();
            $scope.consultarCuradurias();
            $scope.arrayEstrato = [1,2,3,4,5,6];
            $scope.obtenerBarrio();
        }
        $scope.init();
        
        $scope.almacenar = function() {
            $scope.item.codigobarrio = $scope.item.barrio.codigo;
            $scope.item.nombrebarrio = $scope.item.barrio.nombre;
            $scope.item.comuna = $scope.item.barrio.comuna;
            $scope.item.estado = 'expedida';
            $http.post(root+"licencias/crear", $scope.item).then(function(result) {
                $scope.result = result;
            })
        }
    }
]);
