saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("sig-consultar-respuesta", {
            url: "/sig/consultar_respuesta",
            views: {
                "main": {
                    controller: "SIGConsultarRespuestaCtrl",
                    templateUrl: "../bundles/SIGBundle/consultarRespuesta/consultarRespuesta.tpl.html"
                }
            }
        });
    }
]).controller("SIGConsultarRespuestaCtrl", ["$scope", "root","$stateParams", "$timeout", "$state",
    function ($scope, root, $stateParams, $timeout, $state) {
        
        $scope.duplicado = false;
        $scope.root = root;
        $scope.hideAlert = function () {
            $scope.validator = {};
        };

        function callback(data) {
            $scope.validator = {};
            $scope.validator.alert = {};
            $scope.validator.alert.title = data.title;
            $scope.validator.alert.content = data.msg;
            $scope.validator.alert.type = data.type;
            $("html, body").animate({
                scrollTop: 0
            }, "slow", "swing");
        };       

   
        $scope.save = function () {           
            Upload.upload({
                url: 'sig/consultar_respuesta',
                data: {
                    data: $scope.proceso
                }
            }).then(function (response) {
                $scope.result = response.data;
                callback(response.data);
                if (response.data.success) {
                    $scope.proceso = {};
                }
                $timeout(function() {                        
                        $state.go('listar-peticion');
                        }, 3000);
            });
        };
        

        $scope.cancel = function () {
        };
    }
]);
