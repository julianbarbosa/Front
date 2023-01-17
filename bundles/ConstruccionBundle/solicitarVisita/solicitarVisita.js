saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("solicitar-visita", {
            url: "/expediente/solicitar_visita/:idsolicitud",
            views: {
                "main": {
                    controller: "SolicitarVisitaCtrl",
                    templateUrl: "../bundles/ConstruccionBundle/solicitarVisita/solicitarVisita.tpl.html"
                }
            }
        });
    }
]).controller("SolicitarVisitaCtrl", ["$scope", "$stateParams", "TipoVisita","dsJqueryUtils", "Upload", "$timeout", "$state",
    function ($scope, $stateParams, TipoVisita,  dsJqueryUtils, Upload, $timeout, $state) {        
        $scope.proceso = {};
        $scope.proceso.idsolicitud = $stateParams.idsolicitud;        
        $scope.ocultarModal = true;       
        $scope.isReadOnly=false;
        TipoVisita.query().$promise.then(function(response){
            $scope.tiposVisita = response;
            $scope.tiposVisitaFiltrado  = $scope.tiposVisita;
            $scope.proceso.tipovisita = null;
        });
        $scope.tiposVisitaEliminados = [];
        $scope.tiposVisitaXSolicitud = [{idTipoVisita: -1}];
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
            var validator = {};
            var cantidad = 0;
            angular.forEach($scope.tiposVisitaXSolicitud, function(tipoVisita) {
                if(tipoVisita.idTipoVisita>0){
                    cantidad++;
                }
            });                 
            if (cantidad<1) {                
                validator.tipoVisitaXSolicitud = "Seleccione al menos un tipo de visita.";
            }            
            $scope.validator = validator;
            return $.isEmptyObject(validator);
        };
                

        $scope.save = function () {
            var validate = validateSave();
            if (validate) {
                Upload.upload({
                    url: 'visita_solicitud',
                    data: {
                        idsolicitud: $scope.proceso.idsolicitud,
                        observacion: $scope.proceso.observacion,
                        data: $scope.tiposVisitaXSolicitud
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
        
        $scope.addNew = function(){
            $scope.tiposVisitaXSolicitud.push($scope.proceso.tipovisita);            
            $scope.proceso.tipovisita = null;
            angular.forEach($scope.tiposVisita, function(tipoVisita) {
                var estaEnLista = false;
                angular.forEach($scope.tiposVisitaXSolicitud, function(selected){
                    if(selected.idTipoVisita === tipoVisita.idTipoVisita){
                        estaEnLista = true;
                    }                    
                });                        
                if(estaEnLista === true){
                    var index = $scope.tiposVisitaFiltrado.indexOf(tipoVisita);
                    $scope.tiposVisitaFiltrado.splice(index, 1);
                    $scope.tiposVisitaEliminados.push(tipoVisita);
                }
            });   
        };
	    
        $scope.remove = function(idTipoVisita) {            
            angular.forEach($scope.tiposVisitaEliminados, function(tipoVisita) {
                if(tipoVisita.idTipoVisita === idTipoVisita)                     
                    $scope.tiposVisitaFiltrado.push(tipoVisita);
                }
            );            
            angular.forEach($scope.tiposVisitaXSolicitud, function(selected) {
                console.log(selected, "idtipovisita="+idTipoVisita);
                if(selected.idTipoVisita === idTipoVisita){
                    var index = $scope.tiposVisitaXSolicitud.indexOf(selected);
                    $scope.tiposVisitaXSolicitud.splice(index, 1);
                }                    
            }); 
        };
    }
]);
