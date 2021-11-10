saul.config(["$stateProvider", function(a) {
    a.state("crear-lineademarcacion", {
        url: "/lineademarcacion/crear/:idLinea",
        views: {
            main: {
                controller: "CrearLineaDemarcacionCtrl",
                templateUrl: "../bundles/LineasBundle/crear/crear.tpl.html"
            }
        }
    })
}]).controller("CrearLineaDemarcacionCtrl", ["$scope", "root", "urlPlugInNomenclatura", "$stateParams", "Barrio", "TipoVia", "ClaseVia", "LineaDemarcacion", "Demarcacion", "LineaDemarcacionIDESC", "dsJqueryUtils",  
    function($scope, root, urlPlugInNomenclatura, $stateParams, Barrio, TipoVia, ClaseVia, LineaDemarcacion, Demarcacion, LineaDemarcacionIDESC, dsJqueryUtils) {
        
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
        $scope.item = {};
        $scope.root = root;
        $scope.demarcacion = {};
        $scope.item.frentes = [];
        $scope.item.demarcaciones = [];        
        $scope.item.idLinea = $stateParams.idLinea;
        $scope.maxlengthcodigounico = 30;
        $scope.maxlengthnumeropredial = 13;
        $scope.faltante_codigo_unico = $scope.maxlengthcodigounico;
        $scope.urlLinea = null;
     
        $scope.$watch("item.codigo_unico", function() {
            angular.isUndefined($scope.item.codigo_unico) || ($scope.faltante_codigo_unico = $scope.maxlengthcodigounico - $scope.item.codigo_unico.length, 30 == $scope.item.codigo_unico.length && (LineaDemarcacionIDESC.query({
                id: $scope.item.codigo_unico
            }).$promise.then(function(result) {
                $scope.urlLinea = result[0].url1;
            })));
        });
        
        $scope.faltante_numero_predial = $scope.maxlengthnumeropredial;
        
        $scope.$watch("item.numero_predial", function() {
            if(!angular.isUndefined($scope.item.numero_predial)) {
                $scope.faltante_numero_predial = $scope.maxlengthnumeropredial - $scope.item.numero_predial.length;
            } 
        });
        
        LineaDemarcacion.find({id: 0, idLinea: $scope.item.idLinea}).$promise.then(function(result) {     
            if(result.success) {
                $scope.item = result;                                   
                $scope.item.numero_predial = result.predio.numero;
                $scope.item.codigo_unico = result.predio.codigounico;    
                Demarcacion.query({id: result.id}).$promise.then(function(result) {
                    $scope.item.demarcaciones = result;                
                }).finally(function() {
                    $(".overlap_espera").fadeOut(500, "linear");
                    $(".overlap_espera_1").fadeOut(500, "linear");
                });
            } else {
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
            }
        });
        
        $scope.localizaciones = [{id: 1,nombre: "Nor-Este"}, {id: 2,nombre: "Nor-Oeste"}, {id: 3,nombre: "Sur-Este"}, {id: 4,nombre: "Sur-Oeste"}];
    
        TipoVia.query().$promise.then(function(result) {
            $scope.tiposvia = result;
        });
        
        ClaseVia.query().$promise.then(function(result) {
            $scope.clasesVias = result;
        });
        
        $scope.getBarrios = function (viewValue) {
            return Barrio.query({"clave": viewValue}).
                $promise.then(function (response) {
                    if (response.length == 0) {
                        console.log("no encontró resultados");
                    }
                    return response.map(function (item) {
                        return item;
                    });
                });
        };
        
        angular.isUndefinedOrNull = function(value) {
            return angular.isUndefined(value) || null === value
        };
        
        $scope.agregarDemarcacion = function(data) {
            $scope.item_demarcacion = {
                tipoVia: data.tipoVia,
                nombreVia: data.nombreVia,
                claseVia: data.claseVia,
                antejardinIzq: angular.isUndefinedOrNull(data.antejardinIzq) ? 0 : data.antejardinIzq,
                antejardinDer: angular.isUndefinedOrNull(data.antejardinDer) ? 0 : data.antejardinDer,
                andenIzq: angular.isUndefinedOrNull(data.andenIzq) ? 0 : data.andenIzq,
                andenDer: angular.isUndefinedOrNull(data.andenDer) ? 0 : data.andenDer,
                calzada: angular.isUndefinedOrNull(data.calzada) ? 0 : data.calzada,
                via: angular.isUndefinedOrNull(data.via) ? 0 : data.via,
                frente: angular.isUndefinedOrNull(data.frente) ? 0 : parseFloat(data.frente),
                observacion: data.observacion
            };
            $scope.item.demarcaciones.push($scope.item_demarcacion);
            $scope.demarcacion = [];
        };
        
        $scope.quitarDemarcacion = function($index) {
            $scope.item.demarcaciones.splice($index, 1);
        };
        
        $scope.onSelect = function ($item, $model, $label) {
            $scope.$item = $item;
            $scope.$model = $model;
            $scope.$label = $label;
        };
        
        $scope.hideAlert = function() {
            $scope.validator = {};
        };
        
        $scope.obtenerModalIngresoDireccion = function() {
            $.ajax({
                url: urlPlugInNomenclatura,
                data: {
                    fieldNamecallbackFunction: "cerrarModal",
                    fieldNameNPNrequerido: !1,
                    activarBusqueda: !0,
                    fieldNameDiv: "modalIngresoDireccion",
                    fieldNameNumeroUnico: "NPN",
                    fieldNameDireccion: "BusquedaDireccion",
                    fieldNameDireccionVisual: "BusquedaDireccionVisual",
                    fieldNameDireccionAdicional: "BusquedaInformacionAdicional"
                },
                success: function(a) {
                    $("#modalIngresoDireccion").empty(), $("#modalIngresoDireccion").append(a), $("#modalIngresoDireccion").modal("show")
                }
            })
        };
        
        $scope.save = function(finalizar) {
            $(".overlap_espera").show();
            $(".overlap_espera_1").show();
            $scope.item.informacionadicional = '';
            if(!($scope.es_lote === true)) {                
                $scope.item.direccion = document.getElementById("BusquedaDireccionVisual").value;
                $scope.item.informacionadicional = document.getElementById("BusquedaInformacionAdicional").value;
            }      
            $scope.item.codigo_unico = document.getElementById("NPN").value;
            dsJqueryUtils.goTop();
            LineaDemarcacion.save({
                data: $scope.item,
                demarcaciones: $scope.item.demarcaciones,
                finalizar: finalizar
            }).$promise.then(function(result) {
                callback(result);
                $(".overlap_espera").fadeOut(500, "linear");
                $(".overlap_espera_1").fadeOut(500, "linear");
            });
            $scope.ocultarModal = !1;
        };
    }]);
