saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("main", {
            url: "/main",
            views: {
                "main": {
                    controller: "MainCtrl",
                    templateUrl: "../bundles/ConstruccionBundle/main/main.tpl.html"
                }
            }
        });
    }
])        
        .controller("MainCtrl", ["$scope", "$modal",
            function ($scope, $modal) {
                $scope.peticion = "";
                $scope.ocultarModal = true;
                
                $scope.files = {};
                
                
                $scope.newModalUsuario = function (scope) {
                    var modalInstance = $modal.open({
                        controller: 'ModalUsuarioCtrl',
                        templateUrl: '/bundles/ConstruccionBundle/main/modalUsuario.tpl.html',
                        scope: $scope,
                        backdrop: 'static',
                        show: true,
                        resolve: {
                            identificacion: function () {
                                return $scope.peticion.usuario;
                            }
                        }
                    });
                    
                    modalInstance.result.then(function (usuario) {
                        $scope.peticion.usuario = usuario.identificacion + " - " + usuario.nombre + " " + usuario.apellido;
                        $scope.peticion.new_usuario = usuario;
                    });
                };
                
                $scope.newModalUsuario($scope);
                
                $scope.newModalCliente = function (scope) {
                    var modalInstance = $modal.open({
                        controller: 'ModalClienteCtrl',
                        templateUrl: '/bundles/ConstruccionBundle/main/modalCliente.tpl.html',
                        scope: $scope,                        
                        windowClass: 'app-modal-window',
                        resolve: {
                            identificacion: function () {
                                return $scope.peticion.usuario;
                            }
                        }
                    });
                    
                    modalInstance.result.then(function (usuario) {
                        $scope.peticion.usuario = usuario.identificacion + " - " + usuario.nombre + " " + usuario.apellido;
                        $scope.peticion.new_usuario = usuario;
                    });
                };
                
                $scope.newModalCliente($scope);
            }
        ]);
