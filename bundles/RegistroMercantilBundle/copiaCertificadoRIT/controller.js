saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("copia-certificado-rit", {
            url: "/rit/copiacertificado",
            views: {
                "main": {
                    controller: "CopiaCertificadoRITCtrl",
                    templateUrl: "../bundles/RegistroMercantilBundle/copiaCertificadoRIT/template.tpl.html"
                }
            }
        });
    }
]).controller("CopiaCertificadoRITCtrl", ["$scope", "$stateParams", "$http", "root", "LoadingOverlap",
    function ($scope, $stateParams, $http, root, LoadingOverlap) {
        $scope.root = root;
        $scope.data = {};
        $scope.formData = {};

        $scope.solicitarDuplicadoCertificado = function () {
            LoadingOverlap.show($scope);
            $http.post(root + "registromercantil/duplicadocertificadoRIT/"+$scope.email+'/'+$scope.numeroidentificacion, {
                transformResponse: function (json, headerGetter) {
                    return angular.fromJson(json);
                }
            }).then(function (response) {
                $scope.response = response.data;
                LoadingOverlap.hide($scope);
            });
        }
    }
]);
