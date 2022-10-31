saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("recibir-acuse-acto-apertura", {
            url: "/expediente/recibir_acuse_acto_apertura/:idsolicitud",
            views: {
                "main": {
                    controller: "RecibirAcuseActoAperturaCtrl",
                    templateUrl: "../bundles/ConstruccionBundle/recibirAcuseActoApertura/recibirAcuseActoApertura.tpl.html"
                }
            }
        });
    }
]).controller("RecibirAcuseActoAperturaCtrl", ["$scope", "$stateParams", "Infraccion", "Upload", "$timeout", "$state",
    function ($scope, $stateParams, Infraccion, Upload, $timeout, $state) {
        $scope.visita = {};
        $scope.proceso = {};
        $scope.proceso.idsolicitud = $stateParams.idsolicitud; 
        $scope.ocultarModal = true;
        $scope.infracciones = Infraccion.query({});

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
                url: 'actoapertura/recibir_acuse',
                data: {
                    data: $scope.proceso
                }
            }).then(function (response) {
                $scope.result = response.data;
                callback(response.data);
                if (response.data.success) {
                    $scope.proceso = {};
                }
                $scope.isSuccess = true;
                $timeout(function() {                        
                    $state.go('listar-peticion');
                    }, 3000);  
            });
        };

        $scope.cancel = function () {
        };
    }
]);
