saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("aprobar-visita", {
            url: "/visita/aprobar_visita/:idVisita",
            views: {
                "main": {
                    controller: "AprobarVisitaCtrl",
                    templateUrl: "../bundles/VisitaBundle/aprobarVisita/aprobarVisita.tpl.html"
                }
            }
        });
    }
]).controller("AprobarVisitaCtrl", ["$scope", "$stateParams", "Visita",  "TipoSolicitud", "FormularioVisita", "dsJqueryUtils", "Upload", "$timeout", "$state",
    function ($scope, $stateParams, Visita, TipoSolicitud, FormularioVisita, dsJqueryUtils, Upload, $timeout, $state) {        
        $scope.visita = {};
        $scope.visita.idVisita = $stateParams.idVisita;        
        $scope.ocultarModal = true;
        Visita.find({id: $stateParams.idVisita }).$promise.then(function(response){        
            $scope.visita = response;         
            $scope.camposformularioVisita = FormularioVisita.query({id:$stateParams.idVisita});
        });         
        $scope.isReadOnly=false;
        $scope.tiposSolicitud = TipoSolicitud.query();
        
        $scope.tipoSolicitud = {};
        $scope.oculto = true;
        $scope.isSuccess = false;
      
        $scope.hideAlert = function () {
            $scope.validator = {};
        };

        
        console.log("campos",$scope.camposformularioVisita);
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
            var validator = {};            
            return $.isEmptyObject(validator);
        };

        $scope.save = function (estado) {
            var validate = validateSave();
            if (validate) {
                Upload.upload({
                    url: 'aprobar_visita',
                    data: {
                        idVisita: $scope.visita.idVisita,
                        estado: estado
                    }
                }).then(function (response) {
                    $scope.result = response.data;
                    callback(response.data);
                    if (response.data.success) {
                        $scope.asignacion = {};
                    }
                    $scope.isSuccess = true;                   
                });
            } else {
                dsJqueryUtils.goTop();
            }
        };

        $scope.cancel = function () {
        };
    }
]);