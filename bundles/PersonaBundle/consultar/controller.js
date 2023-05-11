saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("consultar-persona", {
            url: "/persona/consultar",
            views: {
                "main": {
                    controller: "ConsultarPersonaCtrl",
                    templateUrl: "../bundles/PersonaBundle/consultar/template.tpl.html"
                }
            }
        });
    }
]).controller("ConsultarPersonaCtrl", ["$scope", "$stateParams", "$http", "LoadingOverlap", 'root',
    function ($scope, $stateParams, $http, LoadingOverlap, root) 
    {
        $scope.datos = null;
   
        $scope.validarPermisos = function() {
            LoadingOverlap.show($scope);
            $http.get(root + "usuario/actual").then(function (response) {
                $scope.thisUser =  response.data;
                console.log(response);
                if($scope.thisUser.roles.indexOf('consulta-persona-registraduria') !== -1 && $scope.thisUser.funcionario == 1) {
                    $scope.esFuncionario = true;
                } else {
                    alert("Usted no tiene permisos para realizar esta consulta.");
                    window.location.href = "/";
                }
            }).finally(function(){
                LoadingOverlap.hide($scope);
            });
            
        }
        $scope.validarPermisos();

        $scope.consultar = function () {
            LoadingOverlap.show($scope);
            $http.get(root + "persona/consultar/"+$scope.identificacion).then(function (response) {
                if(response.data.success == false) {
                    bootbox.alert({
                        message: response.data.msg,
                        size: 'small'
                    });
                    window.location.href = "/";
                } 
                else if(response.data.result == "ERROR") {
                    bootbox.alert({
                        message: "No se encontró el registro.",
                        size: 'small'
                    });
                    $scope.limpiar();
                }
                else {
                    $scope.datos = response.data.data[0];
                }
                LoadingOverlap.hide($scope);
            });
        };

        $scope.limpiar = function() {
            $scope.datos = null;
            $scope.identificacion = null;
        }

    }
]);
