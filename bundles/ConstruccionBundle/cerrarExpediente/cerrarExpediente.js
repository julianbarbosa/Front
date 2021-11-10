saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("cerrar-expediente", {
            url: "/expediente/cerrar/:idsolicitud",
            views: {
                "main": {
                    controller: "CerrarExpedienteCtrl",
                    templateUrl: "../bundles/ConstruccionBundle/cerrarExpediente/cerrarExpediente.tpl.html"
                }
            }
        });
    }
]).controller("CerrarExpedienteCtrl", ["$scope", "$stateParams", "Infraccion", "Upload", "$timeout", "$state",
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

        $scope.saveActoArchivo = function () {           
            Upload.upload({
                url: 'actoarchivo/generar',
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
        
        $scope.saveResolucion = function () {           
            Upload.upload({
                url: 'expediente/cerrarConResolucion',
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
