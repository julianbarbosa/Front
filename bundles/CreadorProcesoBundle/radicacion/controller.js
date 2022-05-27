

    
saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("creadorproceso-radicacion", {
            url: "/creadorproceso/radicacion",
            views: {
                "main": {
                    controller: "CreadorProcesoRadicacionCtrl",
                    templateUrl: "../bundles/CreadorProcesoBundle/radicacion/template.tpl.html"
                }
            }            
        }),
        $stateProvider.state("creadorproceso-radicacion-edit", {
            url: "/creadorproceso/radicacion/:id",
            views: {
                "main": {
                    controller: "CreadorProcesoRadicacionCtrl",
                    templateUrl: "../bundles/CreadorProcesoBundle/radicacion/template.tpl.html"
                }
            }            
        });
    }
])
.controller('ModalCampoActividadCtrl', ['$scope', '$uibModalInstance',  function ($scope, $modalInstance) {
    $scope.cerrarModal = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.guardarModal = function(item) {
        $modalInstance.close(item);
    }

}])
.controller("CreadorProcesoRadicacionCtrl", ["$scope", "$http", "root", "LoadingOverlap",'$uibModal',
    function ($scope, $http, root, LoadingOverlap, $modal) {
        $scope.proceso = {};
        $scope.actividad = {};
        $scope.arrayDominio = [];
        $scope.arrayDependencia = [];
        $scope.data = {};
        
        
        $scope.mostrarModalActividad = function($index) {
            $scope.actividadIndex = $index;
            var $modalInstance = $modal.open({
                templateUrl: '../bundles/CreadorProcesoBundle/radicacion/modalActividad.tpl.html',
                controller: 'ModalCampoActividadCtrl',
                scope: $scope,
                size: 'md',
                resolve: {
                    data: function () {
                        return $scope.data;
                    }
                }
            });
            
            $modalInstance.result.then(function (data) {
                $scope.agregarActividad(data);
            });           
           
        }
        
        $scope.mostrarModalCampo = function($index) {
            $scope.actividadIndex = $index;
            var $modalInstance = $modal.open({
                templateUrl: '../bundles/CreadorProcesoBundle/radicacion/modalCampo.tpl.html',
                controller: 'ModalCampoActividadCtrl',
                scope: $scope,
                size: 'lg',
                resolve: {
                    data: function () {
                        return $scope.data;
                    }
                }
            });
            
            $modalInstance.result.then(function (data) {
                $scope.agregarCampo($scope.actividadIndex, data);
            });           
           
        }
        
    
        $scope.agregarCampo = function(actividadIndex, campo) {
            if($scope.proceso.actividad[actividadIndex].elementos == undefined) {
                $scope.proceso.actividad[actividadIndex].elementos = [];
            }
            $scope.proceso.actividad[actividadIndex].elementos.push(campo);            
            $scope.inicializarFomularioCrearCampo();
        }
                
        $scope.inicializarFomularioCrearCampo = function() {
            $scope.campo = {};
            $scope.campo.caracter_minimo = 4;
            $scope.campo.caracter_maximo = 254;
        }
        
        $scope.consultarDependencias = function() {
            LoadingOverlap.show($scope);
            $http.get(root+"dependencia").then(function(response) {
                $scope.arrayDependencia = response.data;
            }).finally(function(){
                LoadingOverlap.hide($scope);
            });
        }
        
        $scope.inicializarProceso = function() {
            $scope.proceso.actividad = [];
            $scope.consultarDependencias();
        }
        $scope.inicializarProceso();
        
        
        $scope.agregarActividad = function(actividad) {
            if($scope.proceso.actividad == undefined) {
                $scope.proceso.actividad = [];
            }
            $scope.proceso.actividad.push(actividad);            
        };
        
        $scope.inicializarFomularioCrearCampo();
        
        $scope.getDominio = function(nombreDominio) {
            // LoadingOverlap.show($scope);
            $http.get(root+"dominio/"+nombreDominio).then(function(response) {
                $scope.arrayDominio[nombreDominio] = response.data;
                console.log($scope.arrayDominio[nombreDominio]);
            }).finally(function(){
                // LoadingOverlap.hide($scope);
            });
            
        }
        
        $scope.getTramites = function (viewValue) {
            LoadingOverlap.show($scope);
            return $http.get('https://saul-dev1.cali.gov.co/saul2/app_dev.php/tramite').then(function (response) {
                console.log(response);
                return response.data.map(function (item) {
                    return item;
                });
                
            }).finally(function() {
                LoadingOverlap.hide($scope);
            });
        };

        $scope.seleccionarProceso = function(procesoSeleccionado) {
            $scope.proceso = procesoSeleccionado;
        }
        
        $scope.guardar = function () {
            $http.post(root+'proceso', this.proceso).then(function(response) {
                console.log(response);
            })
        }
        
        $scope.moverCampoArriba = function(actividad, campo) {
            console.log($scope.proceso);
            arr = $scope.proceso['actividad'];
            const fromIndex = arr.indexOf(actividad); 
            arr2 = $scope.proceso['actividad'][fromIndex]['elementos'];
            const fromIndex2 = $scope.proceso['actividad'][fromIndex]['elementos'].indexOf(campo);
            const elementoAnterior = $scope.proceso['actividad'][fromIndex]['elementos'][fromIndex2-1]
            $scope.proceso['actividad'][fromIndex]['elementos'][fromIndex2-1] = $scope.proceso['actividad'][fromIndex]['elementos'][fromIndex2];
            $scope.proceso['actividad'][fromIndex]['elementos'][fromIndex2] = elementoAnterior; 
            
        }
        
        $scope.moverCampoAbajo = function(actividad, campo) {
            
        }
    }
]);