saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("asignar-abogado", {
            url: "/peticion/asignar_abogado/:idsolicitud",
            views: {
                "main": {
                    controller: "AsignarAbogadoCtrl",
                    templateUrl: "../bundles/ConstruccionBundle/asignarAbogado/asignarAbogado.tpl.html"
                }
            }
        });
    }
]).controller("AsignarAbogadoCtrl", ["$scope", "$stateParams", "Solicitud", "Abogados", "dsJqueryUtils", "Upload", "$timeout", "$state",
    function ($scope, $stateParams, Solicitud, Abogados, dsJqueryUtils, Upload, $timeout, $state) {        
        $scope.proceso = {};
        $scope.proceso.idsolicitud = $stateParams.idsolicitud;      
        $scope.tiposolicitud = {};
        $scope.tiposolicitud.swsaul = false;        
        $scope.isSuccess = false;
        
        $scope.tipoSolicitud = {};
        $scope.oculto = true;
      
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
            if (!proceso.idabogado) {
                validator.idabogado = "Seleccione un abogado.";
            }
            if (!proceso.observacion) {
                validator.observacion = "Ingrese las observaciones.";
            }
            $scope.validator = validator;
            return $.isEmptyObject(validator);
        };
                
        $scope.consultarAbogados = function(idtiposolicitud){
            $scope.abogados = Abogados.query({'idTipoSolicitud': idtiposolicitud});
        };
		
            Solicitud.find({id: $stateParams.idsolicitud}).$promise.then(function (response) {
            $scope.solicitud = response.data;           
            $scope.consultarAbogados($scope.solicitud.idtiposolicitud);
        });
		
        
        $scope.save = function () {            
            var validate = validateSave();
            if (validate) 
            {
                Upload.upload({
                    url: 'solicitud/asignar_abogado',
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
                  //  $timeout(function() {                        
                  //      $state.go('listar-tareas');
                    //    }, 3000);                    
                });
            }
//            else {
//                dsJqueryUtils.goTop();
//            }
        };

        $scope.cancel = function () {
        };
    }
]);
