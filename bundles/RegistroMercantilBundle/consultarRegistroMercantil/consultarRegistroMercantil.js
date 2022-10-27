saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("registro-mercantil-consultar", {
            url: "/registro-mercantil/consultar/:id",
            views: {
                "main": {
                    controller: "RegistroMercantilConsultarCtrl",
                    templateUrl: "../bundles/RegistroMercantilBundle/consultarRegistroMercantil/consultarRegistroMercantil.tpl.html"
                }
            }
        });
    }
]).controller("RegistroMercantilConsultarCtrl", ["$scope", "root", "$http", '$stateParams','LoadingOverlap',
    function ($scope, root, $http, $stateParams, LoadingOverlap) {
        LoadingOverlap.show($scope);
        $http.get(root + 'integracion/camaracomercio/registromercantil/' + $stateParams.id).then(function (result) {
            $scope.data = result.data;
            LoadingOverlap.hide($scope);
        });

    }
]);
