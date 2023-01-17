saul.config(["$stateProvider", function(a) {
    a.state("crear-lineademarcacion-lado-manzana", {
        url: "/lineademarcacion/crearlinealadomanzana/{id:int}",
        views: {
            main: {
                controller: "CrearLineaLadoManzanaCtrl",
                templateUrl: "../bundles/LineasBundle/crearLineaLadoManzana/crearLineaLadoManzana.tpl.html"
            }
        }
    }).state("aprobar-lineademarcacion-lado-manzana", {
        url: "/lineademarcacion/aprobarlinealadomanzana/{id:int}/{aprobar:int}/{accion}",
        views: {
            main: {
                controller: "CrearLineaLadoManzanaCtrl",
                templateUrl: "../bundles/LineasBundle/crearLineaLadoManzana/crearLineaLadoManzana.tpl.html"
            }
        }
    }).state("crear-lineademarcacion-lado-manzana1", {
        url: "/lineademarcacion/crearlinealadomanzana/",
        views: {
            main: {
                controller: "CrearLineaLadoManzanaCtrl",
                templateUrl: "../bundles/LineasBundle/crearLineaLadoManzana/crearLineaLadoManzana.tpl.html"
            }
        }
    }).state("crear-lineademarcacion-lado-manzana2", {
       url: "/lineademarcacion/consultaporpredio/:direccion/:npn",
        views: {
            main: {
                controller: "CrearLineaLadoManzanaCtrl",
                templateUrl: "../bundles/LineasBundle/crearLineaLadoManzana/crearLineaLadoManzana.tpl.html"
            }
        }
    });
}]).controller("CrearLineaLadoManzanaCtrl", ["$scope", "$http", "root",  "$stateParams", "LineaDemarcacionLadoManzana", "LineaDemarcacionLadoManzana2", "Barrio", "Vereda", "TipoVia", "ClaseVia", "dsJqueryUtils",  
    function($scope, $http, root, $stateParams, LineaDemarcacionLadoManzana, LineaDemarcacionLadoManzana2, Barrio, Vereda, TipoVia, ClaseVia, dsJqueryUtils) {
        
        $(".overlap_espera").show();
        $(".overlap_espera_1").show();

        $scope.consultarExistencia = function() {
            console.log($scope.linea.tipoViaPrincipalId);
            if(!angular.isUndefined($scope.linea.tipoViaPrincipalId) &&
               !angular.isUndefined($scope.linea.nombreViaPrincipal) &&
               !angular.isUndefined($scope.linea.tipoViaSecundariaId) &&
               !angular.isUndefined($scope.linea.nombreViaSecundaria)) {
                LineaDemarcacionLadoManzana2.get({'tipoviaprincipal':$scope.linea.tipoViaPrincipalId,
                    'nombreviaprincipal':$scope.linea.nombreViaPrincipal, 
                    'tipoviasecundaria':$scope.linea.tipoViaSecundariaId,
                    'nombreviasecundaria':$scope.linea.nombreViaSecundaria});
                
            }            
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
        
        
        function init(isForm) {
            $scope.root = root;
            $scope.linea = {};    
            $scope.estaGuardando = 0;     
            $scope.accion = "Crear";            
            $scope.linea.observacionesDevolucion = '';
            if($stateParams.accion!==null) {
                $scope.accion = $stateParams.accion;
                console.log("entro a setear accion=> "+$scope.accion);
            }            
            if(isForm) {
                $scope.form.$setUntouched();
                $scope.form.$setPristine();
            }
            if($stateParams.npn) {                  
                LineaDemarcacionLadoManzana.query({direccion:$stateParams.direccion,npn:$stateParams.npn}).$promise.then(function(result){
                    $scope.linea = result[0];                      
                    $scope.linea.direccion = $stateParams.direccion;
                    $scope.linea.npn = $stateParams.npn;
                    
                    if($scope.linea.idBarrioIzquierdo) {
                        $scope.linea.zona = "Urbana";
                    } else {
                        $scope.linea.zona = "Rural";
                    }
                    $(".overlap_espera").fadeOut(500, "linear");
                    $(".overlap_espera_1").fadeOut(500, "linear");
                });                 
            } else if($stateParams.id) {  
                LineaDemarcacionLadoManzana.query({id:$stateParams.id}).$promise.then(function(result){
                    $scope.linea = result[0];
                    if($scope.linea.idBarrioIzquierdo) {
                        $scope.linea.zona = "Urbana";
                    } else {
                        $scope.linea.zona = "Rural";
                    }                    
                    $(".overlap_espera").fadeOut(500, "linear");
                    $(".overlap_espera_1").fadeOut(500, "linear");
                });                 
            } else {
                $scope.linea.zona = "Urbana";
                $scope.linea.definicionDemarcacion = 'automatizada';
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
            }                             
        };
                        
        $scope.$watch("linea.zona", function() {
            if($scope.linea){ 
                $scope.linea.barrio = null;
                $scope.linea.vereda = null;
            }            
        });
        
        TipoVia.query().$promise.then(function(result) {
            $scope.tiposvia = result;
            ClaseVia.query().$promise.then(function(result) {
                $scope.clasesVias = result;
                init();
            });
        });
        
        
        
        $scope.getBarrios = function (viewValue) {
            return Barrio.query({"clave": viewValue}).
                $promise.then(function (response) {
                    if (response.length === 0) {
                        console.log("no encontró resultados");
                    }
                    return response.map(function (linea) {
                        return linea;
                    });
                });
        };
        
        $scope.getVeredas = function (viewValue) {
            return Vereda.query({"clave": viewValue}).
                $promise.then(function (response) {
                    if (response.length === 0) {
                        console.log("no encontró resultados");
                    }
                    return response.map(function (linea) {
                        return linea;
                    });
                });
        };
        
        
        $scope.onSelect = function ($linea, $model, $label) {
            $scope.$linea = $linea;
            $scope.$model = $model;
            $scope.$label = $label;
        };
        
        $scope.hideAlert = function() {
            $scope.validator = {};
        };
        
        
        $scope.save = function(finalizar) {
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
            $scope.estaGuardando = 1;        
            LineaDemarcacionLadoManzana.save({
                data: $scope.linea,                
                finalizar: finalizar
            }).$promise.then(function(result) {
                callback(result);
                init(1);                
            });
            $scope.ocultarModal = !1;
        };
        
        $scope.duplicar = function ()
        {            
            bootbox.confirm("Confirma que desea duplicar esta linea de demarcación?",
                function (result) {
                    $(this).attr('disabled', true);
                    $(this).val('Enviando...');                    
                    if (result)
                    {
                        dsJqueryUtils.goTop();                
                        $http({
                            url: root+'lineademarcacion/duplicar/'+$scope.linea.id, 
                            method: "PUT"                            
                        }).then(function(result) {
                            console.log(result);
                            callback(result.data);               
                        });
                        $scope.ocultarModal = false;
                    }
                });
        };
        
        $scope.anular = function ()
        {            
            bootbox.confirm("Confirma que desea **ANULAR** esta linea de demarcación?",
                function (result) {
                    $(this).attr('disabled', true);
                    $(this).val('Enviando...');                    
                    if (result)
                    {
                        dsJqueryUtils.goTop();                
                        $http({
                            url: root+'lineademarcacion/'+$scope.linea.id, 
                            method: "DELETE"                            
                        }).then(function(result) {
                            console.log(result);
                            callback(result.data);               
                        });
                        $scope.ocultarModal = false;
                    }
                });
        };
        
        $scope.aprobar = function (estado)
        {            
            $scope.linea.estadoAprobacion = estado;
            bootbox.confirm("Confirma que desea <strong>"+estado+"</strong> esta linea de demarcación sin realizar ningún cambio?",
                function (result) {
                    $(this).attr('disabled', true);
                    $(this).val('Enviando...');                    
                    if (result)
                    {
                        dsJqueryUtils.goTop();                
                        $http.post(root+'lineademarcacion/aprobar/', $scope.linea).then(function(result) {                            
                            callback(result.data);               
                        });
                        $scope.ocultarModal = false;
                    }
                });
        };
    }]);
