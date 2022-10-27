saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("recibir-notificacion-acto-apertura", {
            url: "/expediente/recibir_notificacion_acto_apertura/:idsolicitud",
            views: {
                "main": {
                    controller: "RecibirNotificacionActoAperturaCtrl",
                    templateUrl: "../bundles/ConstruccionBundle/recibirNotificacionActoApertura/recibirNotificacionActoApertura.tpl.html"
                }
            }
        });
    }
]).controller("RecibirNotificacionActoAperturaCtrl", ["$scope", "$stateParams", "Upload", "$timeout", "$state",
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
                url: 'actoapertura/recibir_notificacion',
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
