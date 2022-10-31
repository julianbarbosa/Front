saul.config(["$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("linea-demarcacion-firmarOficio", {
            url: "/lineas/oficio/firmar/:idsolicitud",
            views: {
                "main": {
                    controller: "FirmarOficioLineaDemarcacionCtrl",
                    templateUrl: "../bundles/LineasBundle/firmarOficio/firmarOficio.tpl.html"
                }
            }
        });
    }
]).controller("FirmarOficioLineaDemarcacionCtrl", ["$scope", "$http", "root", "$stateParams", "DevolverLineaDemarcacion", "FirmaLineaDemarcacion", "LineaDemarcacion","dsJqueryUtils", "$uibModal",
    function ($scope, $http, root, $stateParams, DevolverLineaDemarcacion, FirmaLineaDemarcacion, LineaDemarcacion, dsJqueryUtils, $uibModal) {
        
        $scope.root = root;
        $scope.item = {}; 
        $scope.item.idSolicitud = $stateParams.idsolicitud;
        
        $('.overlap_espera').show();            
        $('.overlap_espera_1').show();        
        
        LineaDemarcacion.find({id: $scope.item.idSolicitud}).$promise.then(function (response) { 
            $scope.item = response;
            $scope.item.comentarios_anteriores = $scope.item.comentarios;
            $scope.item.comentarios = '';
            $scope.item.numero_predial = response.numeroPredialLocal;
            $scope.item.codigo_unico = response.numeroPredialNacional; 
        }).finally(function() {
            $scope.obtenerOficioDiligenciado();                       
            $('.overlap_espera').fadeOut(500, 'linear');
            $('.overlap_espera_1').fadeOut(500, 'linear');                
        });
 
        angular.isUndefinedOrNull = function(val) {
            return angular.isUndefined(val) || val === null 
        }
       
        $scope.hideAlert = function () {
            $scope.validator = {};
        };

        function callback(data) {            
            $scope.validator = {};
            $scope.validator.alert = {};
            $scope.validator.alert.title = "Información: ";
            $scope.validator.alert.content = data.msg;
            $scope.validator.alert.type = data.type;
            $("html, body").animate({
                scrollTop: 0
            }, "slow", "swing");
        };


        $scope.firmarOficio = function (certificar)
        {            
            
            bootbox.confirm("Confirma que desea realizar esta acción?",
                function (result) {
                    $(this).attr('disabled', true);
                    $(this).val('Enviando...');
                    if (result)
                    {
                        $('.overlap_espera').show();            
                        $('.overlap_espera_1').show();    
                        dsJqueryUtils.goTop();                
                        $http.post(root+"linea/oficio/firmar", {"id":$scope.item.idSolicitud}).then(function (response) {  
                            $('.overlap_espera').fadeOut(500, 'linear');
                            $('.overlap_espera_1').fadeOut(500, 'linear');      
                            callback(response.data);                            
                        }, function(response,status,headers,config) {
                            $('.overlap_espera').fadeOut(500, 'linear');
                            $('.overlap_espera_1').fadeOut(500, 'linear');      
                            callback(response.data);   
                        });
                        $scope.ocultarModal = false;
                    }
                });
        };
        
        $scope.devolver = function ()
        {     
            bootbox.confirm("Confirma que desea realizar esta acción?",
                function (result) {
                    $(this).attr('disabled', true);
                    $(this).val('Enviando...');
                    if (result) {
                        dsJqueryUtils.goTop();                
                        DevolverLineaDemarcacion.save({"idsolicitud": $scope.item.idSolicitud, "comentarios": $scope.item.comentarios}).$promise.then(function (response) {                    
                            callback(response);
                        });
                        $scope.ocultarModal = false;
                    }
                }
            );            
        };
        
        $scope.obtenerOficioDiligenciado = function() {
            $http.get(root+"linea/oficio/obtenerdiligenciado/"+$scope.item.idSolicitud).then(function(response) {
                $scope.item.textoRespuesta = response.data.respuesta;
            });
        }
        

        $scope.cancel = function () {
        };
    }
]);
