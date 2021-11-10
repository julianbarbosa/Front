saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("proceso-manual", {
            url: "/expediente/proceso_manual/:idsolicitud",
            views: {
                "main": {
                    controller: "ProcesoManualCtrl",
                    templateUrl: "../bundles/ConstruccionBundle/procesoManual/procesoManual.tpl.html"
                }
            }
        });
    }
]).controller("ProcesoManualCtrl", ["$scope", "$stateParams", "EstadoXSolicitud", "Upload", "$timeout", "$state",
    function ($scope, $stateParams, EstadoXSolicitud, Upload, $timeout, $state) {
        $scope.visita = {};
        $scope.proceso = {};
        $scope.proceso.idsolicitud = $stateParams.idsolicitud; 
        $scope.estados = EstadoXSolicitud.query({idsolicitud:$stateParams.idsolicitud});
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
                url: 'expediente/cambiar_estado',
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
