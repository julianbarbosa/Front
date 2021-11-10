saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("apertura-proceso", {
            url: "/expediente/abrir/:idsolicitud",
            views: {
                "main": {
                    controller: "AbrirExpedienteCtrl",
                    templateUrl: "../bundles/ConstruccionBundle/abrirExpediente/abrirExpediente.tpl.html"
                }
            }
        });
    }
]).controller("AbrirExpedienteCtrl", ["$scope", "$stateParams","Infraccion", "dsJqueryUtils", "Upload", "$timeout", "$state",
    function ($scope, $stateParams, Infraccion, dsJqueryUtils, Upload, $timeout, $state) {
        $scope.visita = {};
        $scope.proceso = {};
        $scope.proceso.idsolicitud = $stateParams.idsolicitud; 
        $scope.ocultarModal = true;
        $scope.infracciones = Infraccion.query({});
        $scope.isSuccess = false;
      

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

        function validateSave() {
            var validator = {},
                proceso = $scope.proceso;
            if (!proceso.existe_infraccion) {
                validator.existe_infraccion = "Valide si existe infracción.";
            }
            $scope.validator = validator;
            return $.isEmptyObject(validator);
        };

        $scope.save = function () {
            var validate = validateSave();
            if (validate) {
                Upload.upload({
                    url: 'expediente/',
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
            } else {
                dsJqueryUtils.goTop();
            }
        };

        $scope.cancel = function () {
        };
    }
]);
