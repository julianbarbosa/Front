saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("asignar-peticion", {
            url: "/peticion/asignar/:idsolicitud",
            views: {
                "main": {
                    controller: "AsignarPeticionCtrl",
                    templateUrl: "../bundles/ConstruccionBundle/asignarPeticion/asignarPeticion.tpl.html"
                }
            }
        });
    }
]).controller("AsignarPeticionCtrl", ["$scope", "$stateParams", "TipoSolicitud", "Abogados", "dsJqueryUtils", "Upload", "$timeout", "$state",
    function ($scope, $stateParams, TipoSolicitud, Abogados, dsJqueryUtils, Upload, $timeout, $state) {        
        $scope.proceso = {};
        $scope.proceso.idsolicitud = $stateParams.idsolicitud;      
        $scope.tiposolicitud = {};
        $scope.tiposolicitud.swsaul = false;        
        $scope.tiposSolicitud = TipoSolicitud.query();
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
            if (!proceso.idtiposolicitud) {
                validator.idtipopeticion = "Seleccione un tipo de solicitud.";
            }            
            $scope.validator = validator;
            return $.isEmptyObject(validator);
        };
                
        $scope.consultarAbogados = function(){
            $scope.abogados = Abogados.query({'idTipoSolicitud': $scope.proceso.tiposolicitud.idtiposolicitud});
        };
        
        $scope.save = function () {
            console.log("entro al save");
           // var validate = validateSave();
            //if (validate) 
            {
                Upload.upload({
                    url: 'solicitud/asignar',
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
//                    $timeout(function() {                        
//                        $state.go('listar-tareas');
//                        }, 3000);                    
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
