saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("enviar-citacion-acto-apertura", {
            url: "/expediente/enviar_citacion_acto_apertura/:idsolicitud",
            views: {
                "main": {
                    controller: "EnviarCitacionActoAperturaCtrl",
                    templateUrl: "../bundles/ConstruccionBundle/enviarCitacionActoApertura/enviarCitacionActoApertura.tpl.html"
                }
            }
        });
    }
]).controller("EnviarCitacionActoAperturaCtrl", ["$scope", "$stateParams", "Upload", "$timeout", "$state",
    function ($scope, $stateParams, Upload, $timeout, $state) {
        $scope.visita = {};
        $scope.proceso = {};
        $scope.proceso.idsolicitud = $stateParams.idsolicitud; 
        $scope.ocultarModal = true;

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
                url: 'actoapertura/registrar_guia',
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
